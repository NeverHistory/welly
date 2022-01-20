import {IaC} from "../initialiseProject/createPrompt.js";
import {proc} from "../lib/lib.js";
import {sep} from "path";
import {logger} from "../lib/logger.js";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

export async function awsDeploy(pathToZips: string[], iac: IaC, deployDir: string): Promise<void> {
    const {sourceBucket, awsRegion} = await getDeployConfig(iac, deployDir);
    logger.debug(sourceBucket);
    if (sourceBucket) {
        pathToZips.forEach((zipPath) => {
            logger.debug(zipPath);
            const client = new S3Client({region: awsRegion});
            // PutObjectCommand;
        });
    }
}


async function getDeployConfig(iac: IaC, deployDir: string): Promise<{ awsRegion: string; sourceBucket: string }> {
    if (iac == IaC.Terraform) {
        return getTerraformConfig(deployDir);
    }
}

async function getTerraformConfig(deployDir: string): Promise<{ awsRegion: string; sourceBucket: string }> {
    const r = {
        sourceBucket: "",
        awsRegion: ""
    };


    await proc("terraform output -raw source_bucket", {cwd: `${process.cwd()}${sep}${deployDir}`}).then(({
        stderr,
        stdout
    }) => {
        if (stdout) {
            r.sourceBucket = stdout;
        } else {
            logger.error(stderr);
        }
    }).catch(e => logger.error(e));


    await proc("terraform output -raw bucket_region", {cwd: `${process.cwd()}${sep}${deployDir}`}).then(({
        stderr,
        stdout
    }) => {
        if (stdout) {
            r.awsRegion = stdout;
        } else {
            logger.error(stderr);
        }
    }).catch(e => logger.error(e));


    return r;

}
