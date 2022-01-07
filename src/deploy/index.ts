import {logger} from "../lib/logger.js";
import {loadWellyRC} from "../lib/wellyRC.js";
import {proc} from "../lib/lib.js";
import {sep} from "path";

interface Deploy {
    fast: boolean;
}

export async function runDeploy(props: Deploy): Promise<void> {
    const wellRC = loadWellyRC();

    if (props.fast) {
        logger.info("uuuh... im doing smthing quickly");
        if (typeof wellRC.fast_deploy !== "string") {
            logger.info(`I should deploy to ${wellRC.fast_deploy.cloudProvider}`);
            logger.info(`I should deploy with ${wellRC.fast_deploy.iac}`);
        } else {
            const spinner = logger.loading("Running fast deploy");
            await proc(wellRC.fast_deploy, {cwd: `${process.cwd()}${sep}${wellRC.iac_dir}`})
                .then(({stdout, stderr}) => {
                    logger.debug(JSON.stringify([stdout, stderr]));
                    if (stderr) {
                        spinner.fail(stderr);
                    } else {
                        spinner.succeed(stdout);
                    }
                }).catch(e => spinner.fail(e.message));

        }
    } else {
        const spinner = logger.loading("Running full deploy");
        await proc(wellRC.full_deploy, {cwd: `${process.cwd()}${sep}${wellRC.iac_dir}`}).then((res) => {
            if (res.stderr) {
                spinner.fail(res.stderr);

            } else {
                spinner.succeed(res.stdout);
            }
        }).catch(e => spinner.fail(e.message));

    }
}