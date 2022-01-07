import chalk from "chalk";
import ora, {Ora} from "ora";
import logSymbols from "log-symbols";

const GITHUB_URL = "https://github.com/ilikesolutions/welly/issues";

export function logWelly(): void {
    console.log(chalk.cyan(" __      __       .__  .__         \n") +
        chalk.cyan("/  \\    /  \\ ____ |  | |  | ___.__.\n") +
        chalk.cyan("\\   \\/\\/   // __ \\|  | |  |<   |  |\n") +
        chalk.cyan(" \\        /\\  ___/|  |_|  |_\\___  |\n") +
        chalk.cyan("  \\__/\\  /  \\___  >____/____/ ____|\n") +
        chalk.cyan("       \\/       \\/          \\/     "));

    console.log("\n");
}

export class logger {
    static debug = (message: string): void => {
        console.debug(chalk.gray(`DEBUG: ${message}`));
    };
    static warn = (message: string): void => {
        console.warn(logSymbols.warning + chalk.yellow(` ${message}`));
    };
    static info = (message: string): void => {
        console.log(logSymbols.info + " " + message);
    };
    static error = (message: string, options?: { kill?: boolean, ourFault?: boolean }): void => {
        console.log(logSymbols.error + chalk.red(" Ran into a problem"));
        console.log(chalk.gray(message));
        console.log(chalk.red("\n"));

        if (options.ourFault) {
            console.log(logSymbols.error + chalk.red(` If you are stuck, please report this to ${GITHUB_URL}`));
        }
        if (options.kill) {
            process.exit(1);
        }
    };

    static loading = (message: string): Ora => {
        return ora({text: message, discardStdin: false}).start();
    };
}