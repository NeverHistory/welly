import {sep} from "path";
import {ensureDirSync} from "fs-extra";
import {Answers, CloudProvider, CustomInputOptions, IaC} from "./createPrompt.js";
import {logger} from "../lib/logger.js";
import chalk from "chalk";
import {FastDeployConfig} from "../lib/wellyRC.js";

type CustomCloudSettings = {
    git: string,
    dir: string,
    deploy: string | undefined,
    lambdas: string | undefined
};

export class UserPreferences {
    readonly projectName;
    readonly projectDir;
    readonly customSetup: boolean = false;
    private readonly cloudProvider;
    private readonly infrastructureAsCode;
    private readonly customCloudSettings: CustomCloudSettings;

    constructor(props: Answers) {
        [this.projectName, this.projectDir] = this.validateProjectName(props.projectName);
        this.cloudProvider = props.cloudProvider;
        if (props.cloudProvider == CloudProvider.custom) {
            this.customSetup = true;
            this.customCloudSettings = UserPreferences.validateCustomCloud({
                customGit: props.customGit,
                customDeployDir: props.customDeployDir,
                customDeploy: props.customDeploy,
                customLambdas: props.customLambdas
            });
        } else {
            this.infrastructureAsCode = IaC.Terraform;
        }
    }

    private static validateCustomCloud(props: CustomInputOptions): CustomCloudSettings {
        if (!props.customGit) {
            logger.error("I can't work like this mate... you need to give me a git repo!", {kill: true});
        }

        if (!props.customDeployDir) {
            logger.error("I can't work like this mate... you need to give me a directory where to extract your IaC config!", {kill: true});
        }

        if (!props.customDeploy) {
            logger.warn("If you don't provide me with a way to deploy your IaC, the CLI might not work as intended");
        }

        if (!props.customLambdas) {
            logger.warn("If you don't provide me with a way to deploy your Lambdas, the CLI might not work as intended");
        }

        return {
            git: props.customGit,
            dir: props.customDeployDir,
            deploy: props.customDeploy,
            lambdas: props.customLambdas
        };
    }

    iacTemplate(): string {
        return this.customSetup
            ? this.customCloudSettings.git
            : this.cloudProvider.toLowerCase() + "-" + this.infrastructureAsCode.toLowerCase();
    }

    deployDir(): string {
        return this.customSetup ? this.customCloudSettings.dir : this.infrastructureAsCode.toLowerCase();
    }

    iacDeploy(): string {
        if (this.customSetup) {
            return this.customCloudSettings.deploy;
        }

        if (this.infrastructureAsCode == IaC.Terraform) {
            return "terraform init && terraform apply -auto-approve";
        }
    }

    iacLambdas(): string | FastDeployConfig {
        if (this.customSetup) {
            return this.customCloudSettings.lambdas;
        }

        return {
            iac: this.infrastructureAsCode,
            cloudProvider: this.cloudProvider
        };
    }

    nextSteps(): void {
        if (this.customSetup) {
            logger.info(" I assume you know how to setup and deploy your IaC");
        } else if (this.cloudProvider == CloudProvider.AWS && this.infrastructureAsCode == IaC.Terraform) {
            logger.info(` 1.   Setup your S3 Backend configuration https://www.terraform.io/language/settings/backends/s3 in ${chalk.blue("versions.tf")}`);
            logger.info(" 2.   Start running the build using " + chalk.bgGray("npm start"));
            logger.info(" 3.   Run a full deploy using the CLI");
            logger.info(" 4.   Test your deployment using " + chalk.bgGray(`curl "$(cd ${this.projectDir}${sep}terraform && terraform output -raw base_url)"/`));
            logger.info(" 5.   Make your changes and run fast deploys");
        }
    }

    private validateProjectName(projectName: string | undefined): string[] {
        if (projectName) {
            const projectDir = `${process.cwd()}${sep}${projectName}`;
            ensureDirSync(projectDir);
            return [projectName, projectDir];
        }

        const cwd = `${process.cwd()}`.split(`${sep}`);
        const name = cwd[cwd.length - 1];
        return [name, `${process.cwd()}`];
    }
}
