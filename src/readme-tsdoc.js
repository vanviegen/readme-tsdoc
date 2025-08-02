import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { createProgram, ScriptTarget, SyntaxKind, SymbolFlags, NodeFlags, ModuleResolutionKind, ModuleKind } from 'typescript';

const COMPILER_OPTIONS = {
    target: ScriptTarget.ES2022,
    module: ModuleKind.CommonJS,
    moduleResolution: ModuleResolutionKind.Node16,
    allowJs: true,
    declaration: true,
    esModuleInterop: true,
    skipLibCheck: false,
    forceConsistentCasingInFileNames: true
};

/**
 * Generate markdown documentation for a TypeScript file using TypeScript compiler API
 * @param {string} filePath Path to the TypeScript file
 * @param {string} headingPrefix The heading prefix to use (e.g., '###' for level 3)
 * @param {string} [repoUrl] Optional repository URL for generating deep links (e.g., 'https://github.com/vanviegen/readme-tsdoc')
 * @returns {Promise<string>} Generated markdown documentation
 */
export function generateMarkdownDoc(filePath, headingPrefix, repoUrl) {
    const program = createProgram([filePath], COMPILER_OPTIONS);
    const checker = program.getTypeChecker();
    const sourceFile = program.getSourceFiles().find(sf => 
        path.resolve(sf.fileName) === path.resolve(filePath)
    );
    
    if (!sourceFile?.symbol?.exports) {
        throw new Error(`No exports found in ${filePath}`);
    }
    
    let output = '';
    for (const [name, symbol] of sourceFile.symbol.exports) {
        output += generateSymbolDoc(name, symbol, checker, headingPrefix, sourceFile, repoUrl);
    }
    return output;
}

/**
 * Generate a deep link to the symbol in the repository
 * @param {string} repoUrl The repository URL
 * @param {string} filePath The absolute file path
 * @param {number} lineNumber The line number where the symbol is defined
 * @returns {string} The deep link URL
 */
function generateDeepLink(repoUrl, filePath, lineNumber) {    
    // Get the relative path within the git repo (also verifies it exists)
    const relativePath = execSync(`git ls-files --full-name "${filePath}"`, {
        encoding: 'utf8'
    }).trim();
    
    if (!relativePath) return undefined;
    
    const baseUrl = repoUrl.replace(/\/$/, '');
    
    // Determine if it's a GitLab URL
    if (baseUrl.match(/:\/\/(www\.)?gitlab\.com/)) {
        return `${baseUrl}/-/blob/main/${relativePath}#L${lineNumber}`;
    } else {
        return `${baseUrl}/blob/main/${relativePath}#L${lineNumber}`;
    }
}

/**
 * Generate documentation for a single symbol
 */
function generateSymbolDoc(name, symbol, checker, headingPrefix, sourceFile, repoUrl) {
    const { declaration, originalSymbol, exportDeclaration } = resolveSymbol(symbol, checker);
    
    if (!declaration) {
        return `${headingPrefix} ${name}\n\n*No declaration found*\n\n`;
    }
    
    const typeInfo = getTypeInfo(originalSymbol, declaration, checker);
    let typeLabel = getTypeLabel(declaration, typeInfo);
    
    // Add an optional deep link to the type label
    if (repoUrl && declaration.pos !== undefined) {
        const lineNumber = sourceFile.getLineAndCharacterOfPosition(declaration.getStart()).line + 1;
        const deepLink = generateDeepLink(repoUrl, sourceFile.fileName, lineNumber);
        if (deepLink) {
            typeLabel = `[${typeLabel}](${deepLink})`;
        }
    }
    
    let doc = `${headingPrefix} ${name} · ${typeLabel}\n\n`;
    
    // Try to extract JSDoc from export declaration first, then from resolved declaration
    const jsDocObject = extractJSDoc(exportDeclaration) || extractJSDoc(declaration);
    if (jsDocObject?.comment) {
        doc += `${jsDocObject.comment}\n\n`;
    }
    
    doc += generateTypeSpecificDoc(declaration, typeInfo, checker, headingPrefix, name, sourceFile, repoUrl, jsDocObject);
    
    return doc;
}

/**
 * Resolve symbol to its original declaration, handling re-exports
 */
function resolveSymbol(symbol, checker) {
    let declaration = symbol.valueDeclaration || symbol.declarations?.[0];
    let originalSymbol = symbol;
    let exportDeclaration = declaration; // Keep track of the original export declaration
    
    // Handle export specifiers (export { foo } from './module')
    if (declaration?.kind === SyntaxKind.ExportSpecifier && symbol.flags & SymbolFlags.Alias) {
        try {
            const aliasedSymbol = checker.getAliasedSymbol(symbol);
            if (aliasedSymbol?.valueDeclaration) {
                originalSymbol = aliasedSymbol;
                declaration = aliasedSymbol.valueDeclaration || aliasedSymbol.declarations?.[0];
            }
        } catch (error) {
            // Fall back to original symbol
        }
    }
    // Handle variable declarations that are type assertions (export const foo = bar as Type)
    else if (declaration?.kind === SyntaxKind.VariableDeclaration && declaration.initializer?.kind === SyntaxKind.AsExpression) {
        // For type assertions, try to resolve the original symbol
        try {
            const expr = declaration.initializer.expression;
            if (expr) {
                const innerSymbol = checker.getSymbolAtLocation(expr);
                if (innerSymbol?.valueDeclaration) {
                    originalSymbol = innerSymbol;
                    // Keep the export declaration for JSDoc, but use inner declaration for type info
                    const innerDeclaration = innerSymbol.valueDeclaration || innerSymbol.declarations?.[0];
                    if (innerDeclaration) {
                        declaration = innerDeclaration;
                    }
                }
            }
        } catch (error) {
            // Fall back to original symbol
        }
    }
    
    return { declaration, originalSymbol, exportDeclaration };
}

/**
 * Get type information for a symbol
 */
function getTypeInfo(symbol, declaration, checker) {
    try {
        const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
        return checker.typeToString(type);
    } catch (error) {
        return null;
    }
}

/**
 * Determine the type label for documentation
 */
function getTypeLabel(declaration, typeString) {
    const kind = declaration.kind;
    
    if (kind === SyntaxKind.FunctionDeclaration) {
        return 'function';
    }
    
    if (kind === SyntaxKind.ClassDeclaration) {
        // Check if the class is abstract
        const isAbstract = declaration.modifiers?.some(mod => mod.kind === SyntaxKind.AbstractKeyword);
        return isAbstract ? 'abstract class' : 'class';
    }
    
    if (kind === SyntaxKind.InterfaceDeclaration) {
        return 'interface';
    }
    
    if (kind === SyntaxKind.TypeAliasDeclaration) {
        return 'type';
    }
    
    if (kind === SyntaxKind.VariableDeclaration) {
        // Check if it's a function or class assigned to a const
        if (typeString) {
            if (typeString.includes('=>') || typeString.startsWith('(')) {
                return 'function';
            }
            if (typeString.startsWith('typeof ') && !typeString.includes('=>')) {
                return 'class';
            }
        }
        
        return isConst(declaration) ? 'constant' : 'variable';
    }
    
    // Fallback type detection based on type string
    if (typeString?.includes('=>')) {
        return 'function';
    }
    
    return 'value';
}

/**
 * Check if a variable declaration is const
 */
function isConst(declaration) {
    let node = declaration;
    while (node) {
        if (node.flags & NodeFlags.Const) return true;
        if (node.kind === SyntaxKind.VariableStatement) {
            return node.declarationList?.flags & NodeFlags.Const;
        }
        node = node.parent;
    }
    return false;
}

/**
 * Extract JSDoc object from a declaration
 */
function extractJSDoc(declaration) {
    // First try the declaration itself
    let jsDoc = declaration?.jsDoc?.[0];
    if (jsDoc) {
        return jsDoc;
    }
    
    // For variable declarations, try the parent VariableStatement
    if (declaration?.kind === SyntaxKind.VariableDeclaration) {
        // Check parent (VariableDeclarationList)
        if (declaration.parent?.jsDoc?.[0]) {
            return declaration.parent.jsDoc[0];
        }
        
        // Check grandparent (VariableStatement)
        if (declaration.parent?.parent?.jsDoc?.[0]) {
            return declaration.parent.parent.jsDoc[0];
        }
    }
    
    return null;
}

/**
 * Generate type-specific documentation
 */
function generateTypeSpecificDoc(declaration, typeString, checker, headingPrefix, name, sourceFile, repoUrl, jsDocObject) {
    if (!typeString) {
        return '*Type information unavailable*\n\n';
    }
    
    const kind = declaration.kind;
    
    // For variable declarations that are actually functions or classes
    if (kind === SyntaxKind.VariableDeclaration) {
        if (typeString.includes('=>') || typeString.startsWith('(')) {
            return generateFunctionDoc(declaration, typeString, checker, jsDocObject);
        }
        if (typeString.startsWith('typeof ')) {
            return generateClassDoc(declaration, typeString, checker, headingPrefix, name, sourceFile, repoUrl);
        }
    }
    
    switch (kind) {
        case SyntaxKind.FunctionDeclaration:
            return generateFunctionDoc(declaration, typeString, checker, jsDocObject);
        case SyntaxKind.ClassDeclaration:
        case SyntaxKind.InterfaceDeclaration:
            return generateClassDoc(declaration, typeString, checker, headingPrefix, name, sourceFile, repoUrl);
        case SyntaxKind.TypeAliasDeclaration:
            // For type aliases, show the actual definition rather than resolved type
            const typeNode = declaration.type;
            const actualType = typeNode ? typeNode.getText() : typeString;
            return `**Type:** \`${actualType}\`\n\n`;
        default:
            return `**Value:** \`${typeString}\`\n\n`;
    }
}

/**
 * Generate documentation for functions
 */
function generateFunctionDoc(declaration, typeString, checker, jsDocObject) {
    let doc = `**Signature:** \`${typeString}\`\n\n`;
    
    // For variable declarations, try to extract parameter info from JSDoc
    const resolvedJSDoc = jsDocObject || declaration.jsDoc?.[0];
    if (declaration.kind === SyntaxKind.VariableDeclaration && resolvedJSDoc?.tags) {
        return doc + generateJSDocBasedFunctionDoc(resolvedJSDoc);
    }
    
    // For function declarations, use AST
    if (declaration.typeParameters?.length > 0) {
        doc += generateTypeParameters(declaration.typeParameters, resolvedJSDoc);
    }
    
    if (declaration.parameters?.length > 0) {
        doc += generateParameters(declaration);
    }
    
    doc += generateJSDocTags(resolvedJSDoc);
    
    return doc;
}

/**
 * Generate function documentation based on JSDoc tags
 */
function generateJSDocBasedFunctionDoc(jsDoc) {
    let doc = '';
    
    const paramTags = jsDoc.tags.filter(tag => tag.tagName?.escapedText === 'param');
    if (paramTags.length > 0) {
        doc += '**Parameters:**\n\n';
        for (const tag of paramTags) {
            const name = tag.name?.escapedText || tag.name?.getText?.() || 'unknown';
            const comment = tag.comment || '';
            doc += `- \`${name}\` - ${comment}\n`;
        }
        doc += '\n';
    }
    
    return doc + generateJSDocTags(jsDoc);
}

/**
 * Generate type parameters documentation
 */
function generateTypeParameters(typeParameters, jsDoc = null) {
    let doc = '**Type Parameters:**\n\n';
    
    // Collect template documentation from JSDoc
    const templateDocs = new Map();
    if (jsDoc?.tags) {
        const templateTags = jsDoc.tags.filter(tag => tag.tagName?.escapedText === 'template');
        
        // For each type parameter, try to find its corresponding @template tag
        let templateIndex = 0;
        for (const param of typeParameters) {
            const paramName = param.name.getText();
            
            // Match by position since @template tags don't have explicit parameter names
            if (templateIndex < templateTags.length) {
                const templateTag = templateTags[templateIndex];
                const comment = templateTag.comment || '';
                // Remove leading "- " if present
                const cleanComment = comment.startsWith('- ') ? comment.substring(2) : comment;
                templateDocs.set(paramName, cleanComment);
                templateIndex++;
            }
        }
    }
    
    for (const param of typeParameters) {
        const name = param.name.getText();
        const constraint = param.constraint ? ` extends ${param.constraint.getText()}` : '';
        const defaultType = param.default ? ` = ${param.default.getText()}` : '';
        
        // Get documentation for this parameter
        const comment = templateDocs.get(name);
        const commentText = comment ? ` - ${comment}` : '';
        
        doc += `- \`${name}${constraint}${defaultType}\`${commentText}\n`;
    }
    return doc + '\n';
}

/**
 * Generate parameters documentation
 */
function generateParameters(declaration) {
    let doc = '**Parameters:**\n\n';
    const jsDoc = declaration.jsDoc?.[0];
    
    for (const param of declaration.parameters) {
        const name = param.name.getText();
        const type = param.type ? param.type.getText() : 'any';
        const isOptional = param.questionToken ? '?' : '';
        const hasDefault = param.initializer ? ' (optional)' : '';
        
        // Find JSDoc comment for this parameter
        let comment = '';
        if (jsDoc?.tags) {
            const paramTag = jsDoc.tags.find(tag => 
                tag.tagName?.escapedText === 'param' && 
                (tag.name?.escapedText === name || tag.name?.getText?.() === name)
            );
            comment = paramTag?.comment ? ` - ${paramTag.comment}` : '';
        }
        
        doc += `- \`${name}${isOptional}: ${type}\`${hasDefault}${comment}\n`;
    }
    
    return doc + '\n';
}

/**
 * Generate documentation from JSDoc tags
 */
function generateJSDocTags(jsDoc) {
    if (!jsDoc?.tags) return '';
    
    let doc = '';
    
    const returnTag = jsDoc.tags.find(tag => tag.tagName?.escapedText === 'returns');
    if (returnTag?.comment) {
        doc += `**Returns:** ${returnTag.comment}\n\n`;
    }
    
    const throwsTags = jsDoc.tags.filter(tag => tag.tagName?.escapedText === 'throws');
    if (throwsTags.length > 0) {
        doc += '**Throws:**\n\n';
        throwsTags.forEach(tag => doc += `- ${tag.comment}\n`);
        doc += '\n';
    }
    
    const exampleTags = jsDoc.tags.filter(tag => tag.tagName?.escapedText === 'example');
    if (exampleTags.length > 0) {
        doc += '**Examples:**\n\n';
        exampleTags.forEach(tag => doc += `${tag.comment}\n\n`);
    }
    
    return doc;
}

/**
 * Generate documentation for class declarations
 */
function generateClassDoc(declaration, typeString, checker, headingPrefix, className, sourceFile, repoUrl) {
    let doc = '';
    
    // Handle variable declarations that reference classes
    if (declaration.kind === SyntaxKind.VariableDeclaration) {
        return `**Type:** \`${typeString}\`\n\n`;
    }
    
    // Generate type parameters documentation for classes
    if (declaration.typeParameters?.length > 0) {
        const jsDoc = extractJSDoc(declaration);
        doc += generateTypeParameters(declaration.typeParameters, jsDoc);
    }
    
    // Generate JSDoc tags (examples, etc.) for the class
    const jsDoc = extractJSDoc(declaration);
    doc += generateJSDocTags(jsDoc);
    
    // Extract constructor documentation
    const constructor = declaration.members?.find(m => m.kind === SyntaxKind.Constructor);
    const constructorJSDoc = constructor ? extractJSDoc(constructor) : null;
    if (constructorJSDoc?.tags) {
        const paramTags = constructorJSDoc.tags.filter(tag => 
            tag.tagName?.escapedText === 'param'
        );
        if (paramTags.length > 0) {
            doc += '**Constructor Parameters:**\n\n';
            paramTags.forEach(tag => {
                const name = tag.name?.escapedText || tag.name?.getText?.() || 'unknown';
                doc += `- \`${name}\`: ${tag.comment || ''}\n`;
            });
            doc += '\n';
        }
    }
    
    // Document class members
    const members = declaration.members || [];
    const publicMembers = members.filter(m => 
        !m.name?.getText().startsWith('_') && m.kind !== SyntaxKind.Constructor
    );
    
    const staticMembers = publicMembers.filter(m => 
        m.modifiers?.some(mod => mod.kind === SyntaxKind.StaticKeyword)
    );
    const instanceMembers = publicMembers.filter(m => 
        !m.modifiers?.some(mod => mod.kind === SyntaxKind.StaticKeyword)
    );
    
    [...staticMembers, ...instanceMembers].forEach(member => {
        doc += generateClassMemberDoc(member, checker, staticMembers.includes(member), headingPrefix, className, sourceFile, repoUrl);
    });
    
    return doc;
}

/**
 * Generate documentation for a class member
 */
function generateClassMemberDoc(member, checker, isStatic, headingPrefix, className, sourceFile, repoUrl) {
    const memberName = member.name?.getText() || (member.kind === SyntaxKind.ConstructSignature ? 'new' : 'unknown');
    let memberType = getMemberType(member, isStatic);
    
    const prefix = isStatic ? className : className.charAt(0).toLowerCase() + className.slice(1);
    const heading = `${prefix}.${memberName}`;
    
    // Add an optional deep link to the member type
    if (repoUrl && member.pos !== undefined && sourceFile) {
        const lineNumber = sourceFile.getLineAndCharacterOfPosition(member.getStart()).line + 1;
        const deepLink = generateDeepLink(repoUrl, sourceFile.fileName, lineNumber);
        if (deepLink) {
            memberType = `[${memberType}](${deepLink})`;
        }
    }
    
    let doc = `${headingPrefix}# ${heading} · ${memberType}\n\n`;
    
    const jsDocObject = extractJSDoc(member);
    if (jsDocObject?.comment) {
        doc += `${jsDocObject.comment}\n\n`;
    }
    
    try {
        const symbol = checker.getSymbolAtLocation(member.name);
        if (symbol) {
            const type = checker.getTypeOfSymbolAtLocation(symbol, member);
            const typeString = checker.typeToString(type);
            
            if (member.kind === SyntaxKind.MethodDeclaration) {
                doc += `**Signature:** \`${typeString}\`\n\n`;
                doc += generateParameters(member);
                doc += generateJSDocTags(jsDocObject);
            } else {
                doc += `**Type:** \`${typeString}\`\n\n`;
                if (jsDocObject?.tags) {
                    const exampleTags = jsDocObject.tags.filter(tag => 
                        tag.tagName?.escapedText === 'example'
                    );
                    if (exampleTags.length > 0) {
                        doc += '**Examples:**\n\n';
                        exampleTags.forEach(tag => doc += `${tag.comment}\n\n`);
                    }
                }
            }
        }
    } catch (error) {
        doc += '*Type information unavailable*\n\n';
    }
    
    return doc;
}

/**
 * Determine the type of a class member
 */
function getMemberType(member, isStatic) {
    const isAbstract = member.modifiers?.some(mod => mod.kind === SyntaxKind.AbstractKeyword);
    const abstractPrefix = isAbstract ? 'abstract ' : '';
    const staticPrefix = isStatic ? 'static ' : '';
    const prefix = abstractPrefix + staticPrefix;
    
    const typeMap = {
        [SyntaxKind.MethodDeclaration]: 'method',
        [SyntaxKind.PropertyDeclaration]: 'property',
        [SyntaxKind.GetAccessor]: 'getter',
        [SyntaxKind.SetAccessor]: 'setter',
        [SyntaxKind.ConstructSignature]: 'constructor'
    };
    return prefix + (typeMap[member.kind] || 'member');
}

/**
 * Find the next heading boundary after a given position
 * @param {string} text The text to search in
 * @param {number} startPos The position to start searching from
 * @param {number} maxLevel The maximum heading level to consider as boundary
 * @returns {number} The position of the next boundary, or text length if none found
 */
function findNextHeadingBoundary(text, startPos, maxLevel) {
    const headingRegex = /^(#{1,6})\s+/gm;
    headingRegex.lastIndex = startPos;
    
    let match;
    while ((match = headingRegex.exec(text)) !== null) {
        if (match[1].length <= maxLevel) {
            return match.index;
        }
    }
    
    return text.length;
}

/**
 * Update README file with auto-generated TypeScript documentation
 * @param {string} readmePath Path to the README file to update
 * @param {string} searchPhrase The phrase to search for in the README to mark sections for auto-generation
 * @param {string} [repoUrl] Optional repository URL for generating deep links (e.g., 'https://github.com/vanviegen/readme-tsdoc')
 * @returns {Promise<void>}
 */
export function updateReadme(readmePath, searchPhrase, repoUrl) {
    const readme = fs.readFileSync(readmePath, 'utf8');
    
    const escapedSearchPhrase = searchPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const markerRegex = new RegExp(
        `(^(#{1,6})\\s+)?` +
        `(.*?\n${escapedSearchPhrase}[ \`]*([^\`: ]+)[\`: ]*\\n)`,
        'gm'
    );
    
    let updatedReadme = readme;
    const matches = Array.from(readme.matchAll(markerRegex)).reverse();
    
    if (matches.length === 0) {
        console.error(`Could not find any "${searchPhrase}" markers in ${readmePath}`);
        process.exit(1);
    }
    
    for (const match of matches) {
        const [fullMatch, , precedingHeadingLevel, beforeSearch, sourceFile] = match;
        
        const baseHeadingLevel = precedingHeadingLevel?.length || 2;
        const contentStart = match.index + fullMatch.length;
        const contentEnd = findNextHeadingBoundary(readme, contentStart, baseHeadingLevel);
        
        const headingPrefix = '#'.repeat(baseHeadingLevel + 1);
        
        console.log(`Generating docs for ${sourceFile} with heading level ${baseHeadingLevel + 1}...`);
        const newContent = generateMarkdownDoc(sourceFile, headingPrefix, repoUrl);
        
        const replacement = (precedingHeadingLevel ? `${'#'.repeat(precedingHeadingLevel.length)} ` : '') + 
                          beforeSearch + "\n" + newContent;
        
        updatedReadme = updatedReadme.substring(0, match.index) +
                       replacement + 
                       updatedReadme.substring(contentEnd);
    }
    
    fs.writeFileSync(readmePath, updatedReadme);
    console.log(`Updated documentation for ${matches.length} file(s) in ${readmePath}`);
}