import {UserPreferences} from "./UserPreferences.js";
import {dirname, sep} from "path";
import {proc} from "../lib/lib.js";
import {copySync, ensureDirSync} from "fs-extra";
import {rmSync} from "fs";
import {logger} from "../lib/logger.js";
import {fileURLToPath} from "url";

export class Builder {
    private readonly userPreferences: UserPreferences;

    constructor(up: UserPreferences) {
        this.userPreferences = up;
    }

    private static async pullTemplate(cwd: string, git: string, logName: string): Promise<void> {
        const spinner = logger.loading(`Cloning template ${logName}`).start();

        await proc(`git clone ${git} .`, {cwd: cwd}).then(() => {
            rmSync(`${cwd}${sep}.git`, {force: true, recursive: true});
        })
            .then(() => spinner.succeed(`Cloned ${logName} successfully`))
            .catch(e => {
                spinner.fail("Clone failed");
                logger.error("Do you have git installed?" + JSON.stringify(e, undefined, 2), {kill: true});
            });
    }

    async init(): Promise<string> {
        this.copyTemplateDir("core", this.userPreferences.projectDir);
        const deployDir = `${this.userPreferences.projectDir}${sep}${this.userPreferences.deployDir()}`;
        ensureDirSync(deployDir);

        if (this.userPreferences.customSetup) {
            await Builder.pullTemplate(deployDir, this.userPreferences.iacTemplate(), "for IaC");
        } else {
            this.copyTemplateDir(this.userPreferences.iacTemplate(), deployDir);
        }

        return this.userPreferences.projectName;
    }

    private copyTemplateDir(templateName: string, destination: string): void {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const templateDir = `${__dirname}${sep}..${sep}..${sep}templates${sep}${templateName}${sep}`;
        copySync(templateDir, destination);
    }

}
