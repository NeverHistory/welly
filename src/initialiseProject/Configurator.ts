import {sep} from "path";
import {readFileSync, writeFileSync} from "fs";
import {proc} from "../lib/lib.js";
import {UserPreferences} from "./UserPreferences.js";
import {logger} from "../lib/logger.js";
import {WellyRC} from "../lib/wellyRC.js";

export class Configurator {
    private readonly preferences: UserPreferences;

    constructor(preferences: UserPreferences) {
        this.preferences = preferences;
    }

    async configure(): Promise<void> {
        this.updatePackageName();
        this.updateWellyRC();
        await this.npmInstall().then(() => this.build())
            .catch(e => {
                logger.error(JSON.stringify(e, undefined, 2));
            });

        this.preferences.nextSteps();
    }


    private async npmInstall(): Promise<void> {
        const spinner = logger.loading("Installing dependencies");
        await proc("npm i", {cwd: this.preferences.projectDir})
            .then(() => spinner.succeed("Dependencies installed"))
            .catch(e => {
                spinner.fail("Installation failed");
                logger.error(e, {kill: true, ourFault: true});
            });
    }

    private async build(): Promise<void> {
        await proc("npm run build:prod", {cwd: `${this.preferences.projectDir}`});
    }

    private updatePackageName(): void {
        const packageJson = `${this.preferences.projectDir}${sep}package.json`;
        const content = JSON.parse(readFileSync(packageJson, "utf-8"));
        content.name = this.preferences.projectName;
        writeFileSync(packageJson, JSON.stringify(content, undefined, 2));
    }

    private updateWellyRC(): void {
        const wellyRC = `${this.preferences.projectDir}${sep}.wellyrc.json`;
        const content = JSON.parse(readFileSync(wellyRC, "utf-8")) as WellyRC;
        content.iac_dir = this.preferences.iacDir();
        content.full_deploy = this.preferences.iacDeploy();
        content.fast_deploy = this.preferences.iacLambdas();
        writeFileSync(wellyRC, JSON.stringify(content, undefined, 2));
    }
}