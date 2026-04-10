#!/usr/bin/env node

import { updateReadme } from './readme-tsdoc.js';

const USAGE = `Usage: tsdoc-readme [options]
Options:
  --file <path>       Path to the README file (default: README.md)
  --search <phrase>   Search phrase to locate insertion point (default: "The following is auto-generated from")
  --repo-url <url>    Repository URL for source links (optional)
  --split             Split output into multiple files based on sections (optional)
  --help, -h          Show this help message`;

const { readmePath, searchPhrase, repoUrl, split } = parseCommandLineArgs();
updateReadme(readmePath, searchPhrase, repoUrl, split);

/**
 * Parse command line arguments and return configuration
 * @returns {{readmePath: string, searchPhrase: string, repoUrl?: string, split: boolean}} Parsed configuration object
 */
function parseCommandLineArgs() {
    const args = process.argv.slice(2);
    let readmePath = 'README.md';
    let searchPhrase = 'The following is auto-generated from';
    let repoUrl = undefined;
    let split = false;
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--file' && i + 1 < args.length) {
            readmePath = args[i + 1];
            i++;
        } else if (arg === '--search' && i + 1 < args.length) {
            searchPhrase = args[i + 1];
            i++;
        } else if (arg === '--repo-url' && i + 1 < args.length) {
            repoUrl = args[i + 1];
            i++;
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
    
    return { readmePath, searchPhrase, repoUrl, split };
}
