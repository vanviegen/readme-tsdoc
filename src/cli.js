#!/usr/bin/env node

import { updateReadme, createDocs } from './readme-tsdoc.js';

const USAGE = `Usage: tsdoc-readme [options]
Options:
  --file <path>       Path to the README file (default: README.md)
  --search <phrase>   Search phrase to locate insertion point (default: "The following is auto-generated from")
  --create <file>     Write reference docs for <source.ts> to <file> (mutually exclusive with --file and --search)
  --repo-url <url>    Repository URL for source links (optional)
  --split             Split output into multiple files based on sections (optional)
  --help, -h          Show this help message`;

const { mode, readmePath, searchPhrase, createPath, sourcePath, repoUrl, split } = parseCommandLineArgs();

if (mode === 'create') {
    createDocs(sourcePath, createPath, repoUrl, split);
} else {
    updateReadme(readmePath, searchPhrase, repoUrl, split);
}

/**
 * Parse command line arguments and return configuration
 */
function parseCommandLineArgs() {
    const args = process.argv.slice(2);
    let readmePath = 'README.md';
    let searchPhrase = 'The following is auto-generated from';
    let createPath = undefined;
    let sourcePath = undefined;
    let repoUrl = undefined;
    let split = false;
    const positional = [];

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--file' && i + 1 < args.length) {
            readmePath = args[++i];
        } else if (arg === '--search' && i + 1 < args.length) {
            searchPhrase = args[++i];
        } else if (arg === '--create' && i + 1 < args.length) {
            createPath = args[++i];
        } else if (arg === '--repo-url' && i + 1 < args.length) {
            repoUrl = args[++i];
        } else if (arg === '--split') {
            split = true;
        } else if (!arg.startsWith('--')) {
            positional.push(arg);
        } else {
            if (arg !== '--help' && arg !== '-h') {
                console.warn(`Unknown argument: ${arg}`);
            }
            console.log(USAGE);
            process.exit(1);
        }
    }

    if (createPath !== undefined) {
        if (positional.length !== 1) {
            console.error('--create requires exactly one positional argument: the TypeScript source file');
            console.log(USAGE);
            process.exit(1);
        }
        sourcePath = positional[0];
        return { mode: 'create', createPath, sourcePath, repoUrl, split };
    }

    if (positional.length > 0) {
        console.warn(`Unknown argument: ${positional[0]}`);
        console.log(USAGE);
        process.exit(1);
    }

    return { mode: 'update', readmePath, searchPhrase, repoUrl, split };
}
