import prompt, {QuestionCollection} from "inquirer";
import PromptUI from "inquirer/lib/ui/prompt";

export enum CloudProvider {AWS = "AWS", custom = "custom"}

export enum IaC {Terraform = "Terraform"}

export interface CustomInputOptions {
    customGit?: string,
    customDeployDir?: string,
    customDeploy?: string,
    customLambdas?: string,
}

export interface Answers extends CustomInputOptions {
    projectName: string | undefined,
    cloudProvider: CloudProvider
}

export function createPrompt(): Promise<Answers> & { ui: PromptUI } {
    const whenCustom = (answers: Answers): boolean => answers.cloudProvider === "custom";

    const promptArray: QuestionCollection = [
        {
            type: "input",
            name: "projectName",
            message: "Project name (leave blank to use name of cwd): "
        },
        {
            type: "list",
            name: "cloudProvider",
            message: "Which deployment template are you going to use?",
            choices: [{name: "AWS"}, {name: "custom"}],
        },
        {
            type: "input",
            name: "customGit",
            message: "Your git repo template: ",
            when: whenCustom
        },
        {
            type: "input",
            name: "customDeployDir",
            message: "Directory name in the new file structure to store your IaC code: ",
            when: whenCustom
        },
        {
            type: "input",
            name: "customDeploy",
            message: "Command to execute to deploy your infrastructure: ",
            when: whenCustom
        },
        {
            type: "input",
            name: "customLambdas",
            message: "Command to execute to deploy just your sourcecode: ",
            when: whenCustom
        }
    ];

    return prompt.prompt<Answers>(promptArray);
}
