#!/usr/bin/env node

import {initialiseProject} from "./initialiseProject/index.js";
import {runBuild} from "./build/index.js";
import {logger} from "./lib/logger.js";

async function main(): Promise<void> {
    const cmdArgs = process.argv;
    if (cmdArgs.length == 2) {
        initialiseProject();
    } else if (cmdArgs.length >= 3) {
        switch (cmdArgs[2]) {
        case "it":
            runBuild({watch: true});
            break;
        case "build":
            runBuild({});
            break;
        }
    }
}

main().catch(e => logger.error(e, {kill: true, ourFault: true}));