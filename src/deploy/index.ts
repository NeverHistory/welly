import {logger} from "../lib/logger.js";
import {loadWellyRC} from "../lib/wellyRC.js";
import {spinnerProc} from "../lib/lib.js";
import {sep} from "path";
import {awsDeploy} from "./awsDeploy.js";

interface Deploy {
    fast: boolean;
}

export async function runDeploy(props: Deploy): Promise<void> {
    const wellyRC = loadWellyRC();

    if (props.fast) {
        logger.info("uuuh... im doing smthing quickly");
        if (typeof wellyRC.fast_deploy !== "string") {
            if (wellyRC.fast_deploy.cloudProvider === "AWS") {
                awsDeploy();
            }
        } else {
            await spinnerProc("Running fast deploy", wellyRC.fast_deploy, `${process.cwd()}${sep}${wellyRC.iac_dir}`);
        }
    } else {
        await spinnerProc("Running full deploy", wellyRC.full_deploy, `${process.cwd()}${sep}${wellyRC.iac_dir}`);
    }
}