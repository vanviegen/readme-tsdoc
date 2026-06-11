#!/usr/bin/env node

import { updateReadme, createDocs } from './readme-tsdoc.js';

const USAGE = `Usage: tsdoc-readme [options]
Options:
  --file <path>       Path to the README file (default: README.md); output file when used with --create
  --search <phrase>   Search phrase to locate insertion point (default: "The following is auto-generated from")
  --create <source>   TypeScript source file; generate reference docs into --file (mutually exclusive with --search)
  --repo-url <url>    Repository URL for source links (optional)
  --split             Split output into multiple files based on sections (optional)
  --help, -h          Show this help message`;

const { mode, filePath, searchPhrase, sourcePath, repoUrl, split } = parseCommandLineArgs();

if (mode === 'create') {
    createDocs(sourcePath, filePath, repoUrl, split);
} else {
    updateReadme(filePath, searchPhrase, repoUrl, split);
}

/**
 * Parse command line arguments and return configuration
 */
function parseCommandLineArgs() {
    const args = process.argv.slice(2);
    let filePath = 'README.md';
    let fileExplicit = false;
    let searchPhrase = 'The following is auto-generated from';
    let sourcePath = undefined;
    let repoUrl = undefined;
    let split = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--file' && i + 1 < args.length) {
            filePath = args[++i];
            fileExplicit = true;
        } else if (arg === '--search' && i + 1 < args.length) {
            searchPhrase = args[++i];
        } else if (arg === '--create' && i + 1 < args.length) {
            sourcePath = args[++i];
        } else if (arg === '--repo-url' && i + 1 < args.length) {
            repoUrl = args[++i];
        } else if (arg === '--split') {
            split = true;
        } else {
            if (arg !== '--help' && arg !== '-h') {
                console.warn(`Unknown argument: ${arg}`);
            }
            console.log(USAGE);
            process.exit(1);
        }
    }

    if (sourcePath !== undefined && !fileExplicit) {
        console.error('--file is required when using --create');
        console.log(USAGE);
        process.exit(1);
    }

    if (sourcePath !== undefined) {
        return { mode: 'create', filePath, sourcePath, repoUrl, split };
    }

    return { mode: 'update', filePath, searchPhrase, repoUrl, split };
}
