#!/usr/bin/env node

import {initialiseProject} from "./initialiseProject/index.js";
import {runBuild} from "./build/index.js";
import {logger} from "./lib/logger.js";

async function main(): Promise<void> {
    const cmdArgs = process.argv;
    logger.debug(JSON.stringify(cmdArgs));
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
        default:
            logger.info("Please use one of it or build");
            break;
        }
    }
}

main().catch(e => logger.error(e, {kill: true, ourFault: true}));
