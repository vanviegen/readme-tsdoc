#!/usr/bin/env node

import { updateReadme } from './readme-tsdoc.js';

const { readmePath, searchPhrase, repoUrl } = parseCommandLineArgs();
updateReadme(readmePath, searchPhrase, repoUrl);

/**
 * Parse command line arguments and return configuration
 * @returns {{readmePath: string, searchPhrase: string, repoUrl?: string}} Parsed configuration object
 */
function parseCommandLineArgs() {
    const args = process.argv.slice(2);
    let readmePath = 'README.md';
    let searchPhrase = 'The following is auto-generated from';
    let repoUrl = undefined;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--file' && i + 1 < args.length) {
            readmePath = args[i + 1];
            i++;
        } else if (args[i] === '--search' && i + 1 < args.length) {
            searchPhrase = args[i + 1];
            i++;
        } else if (args[i] === '--repo-url' && i + 1 < args.length) {
            repoUrl = args[i + 1];
            i++;
        }
    }
    
    return { readmePath, searchPhrase, repoUrl };
}
