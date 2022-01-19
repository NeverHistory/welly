import {sep} from "path";
import {readFileSync} from "fs";
import {BuildOptions} from "esbuild/lib/main.js";
import {CloudProvider, IaC} from "../initialiseProject/createPrompt.js";

export interface FastDeployConfig {
    iac: IaC,
    cloudProvider: CloudProvider
}

export interface WellyRC {
    deployDir: string,
    fullDeploy: string,
    fastDeploy: string | FastDeployConfig,
    commands?: {
        [key: string]: string
    }
    build?: BuildOptions
}

export function loadWellyRC(): WellyRC {
    const wellyRC = `${process.cwd()}${sep}.wellyrc.json`;
    return JSON.parse(readFileSync(wellyRC, "utf-8")) as WellyRC;
}