import {IaC} from "../initialiseProject/createPrompt.js";
import {proc} from "../lib/lib.js";
import {sep} from "path";
import {logger} from "../lib/logger.js";

export async function awsDeploy(pathToZips: string[], iac: IaC, deployDir: string): Promise<void> {
    const sourceBucket = await getSourceBucket(iac, deployDir);
    logger.debug(sourceBucket);
    pathToZips.forEach((zipPath) => {
        logger.debug(zipPath);
    });
}


async function getSourceBucket(iac: IaC, deployDir: string): Promise<string> {

    if (iac == IaC.Terraform) {
        const {stdout} = await proc("terraform output -raw source_bucket", {cwd: `${process.cwd()}${sep}${deployDir}`});
        return stdout;
    }

}
