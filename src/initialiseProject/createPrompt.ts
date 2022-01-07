import prompt, {QuestionCollection} from "inquirer";
import PromptUI from "inquirer/lib/ui/prompt";

export enum CloudProvider {AWS = "AWS", custom = "custom"}

export enum IaC {Terraform = "Terraform", Cloudformation = "Cloudformation"}

export interface CustomInputOptions {
    customGit?: string | undefined,
    customIaCDir?: string | undefined,
    customDeploy?: string | undefined,
    customLambdas?: string | undefined,
}

export interface Answers extends CustomInputOptions {
    projectName: string | undefined,
    cloudProvider: CloudProvider,
    IaC?: IaC
}

export function createPrompt(): Promise<Answers> & { ui: PromptUI } {
    const whenCustom = (answers: Answers): boolean => answers.cloudProvider === "custom";
    const whenAws = (answers: Answers): boolean => answers.cloudProvider === "AWS";

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
            choices: [{name: "AWS"}, {name: "GCS", disabled: true}, {name: "custom"}],
        },
        {
            type: "input",
            name: "customGit",
            message: "Your git repo template: ",
            when: whenCustom
        },
        {
            type: "input",
            name: "customIaCDir",
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
        },
        {
            type: "list",
            name: "IaC",
            message: "Which IaC are you comfortable with?",
            choices: [{name: "Terraform (recommended)"}, {name: "Cloudformation", disabled: true}],
            when: whenAws,
            filter(input: string): string {
                return input.replace(" (recommended)", "");
            }
        },
    ];

    return prompt.prompt<Answers>(promptArray);
}