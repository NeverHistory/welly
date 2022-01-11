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
        await spinnerProc("Running full deploy", wellyRC.full_deploy, `${process.cwd()}${sep}${wellyRC.iac_dir}`);
        return;
    }

    if (typeof wellyRC.fast_deploy === "string") {
        await spinnerProc("Running fast deploy", wellyRC.fast_deploy, `${process.cwd()}${sep}${wellyRC.iac_dir}`);
        return;
    }
    logger.info("uuuh... im doing smthing quickly");
    logger.debug(JSON.stringify(buildOptions));
    // const cacheHandler = new CacheHandler(buildOptions);
    //
    // if (wellyRC.fast_deploy.cloudProvider === "AWS") {
    //     await awsDeploy(cacheHandler.findNewZips());
    // }
    //
    // cacheHandler.persist();
}