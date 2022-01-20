import {loadWellyRC} from "../lib/wellyRC.js";
import {spinnerProc} from "../lib/lib.js";
import {sep} from "path";
import {BuildOptions} from "esbuild";
import {CacheHandler} from "./CacheHandler.js";
import {awsDeploy} from "./awsDeploy.js";

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
        await spinnerProc("Running custom fast deploy", wellyRC.fastDeploy, `${process.cwd()}${sep}${wellyRC.deployDir}`);
        return;
    }

    const cacheHandler = new CacheHandler(buildOptions);

    if (wellyRC.fastDeploy.cloudProvider === "AWS") {
        await awsDeploy(cacheHandler.findNewZips(), wellyRC.fastDeploy.iac, wellyRC.deployDir);
    }

}
