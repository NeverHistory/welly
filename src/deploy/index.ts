import {logger} from "../lib/logger.js";
import {loadWellyRC} from "../lib/wellyRC.js";
import {spinnerProc} from "../lib/lib.js";
import {sep} from "path";
import {BuildOptions} from "esbuild";

interface Deploy {
    fast: boolean;
}

export async function runDeploy(props: Deploy, buildOptions: BuildOptions): Promise<void> {
    const wellyRC = loadWellyRC();

    if (!props.fast) {
        await spinnerProc("Running full deploy", wellyRC.fullDeploy, `${process.cwd()}${sep}${wellyRC.deployDir}`);
        return;
    }

    if (typeof wellyRC.fastDeploy === "string") {
        await spinnerProc("Running fast deploy", wellyRC.fastDeploy, `${process.cwd()}${sep}${wellyRC.deployDir}`);
        return;
    }
    logger.info("uuuh... im doing smthing quickly");
    logger.debug(JSON.stringify(buildOptions));
    // const cacheHandler = new CacheHandler(buildOptions);
    //
    // if (wellyRC.fastDeploy.cloudProvider === "AWS") {
    //     await awsDeploy(cacheHandler.findNewZips());
    // }
    //
    // cacheHandler.persist();
}