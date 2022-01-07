import readline from "readline";
import {logger, logWelly} from "../lib/logger.js";
import {loadWellyRC} from "../lib/wellyRC.js";
import {proc} from "../lib/lib.js";
import chalk from "chalk";
import {runDeploy} from "../deploy/index.js";

const SPACING = 40;
const CUT_OFF = 20;

export class KeyInterface {

    private readonly wellyRC;

    constructor() {
        this.wellyRC = loadWellyRC();
    }

    listen(): void {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on("keypress", async (str, key) => {
            if (key.ctrl && key.name === "c") {
                process.exit();
            } else if (key.name === "c") {
                this.refreshConsole();
            } else if (key.name === "f") {
                await runDeploy({fast: true});
            } else if (key.name === "d") {
                await runDeploy({fast: false});
            } else if (Object.keys(this.wellyRC.commands).includes(key.name)) {
                const spinner = logger.loading(`Running ${this.wellyRC.commands[key.name]}`);
                await proc(this.wellyRC.commands[key.name])
                    .then(({stderr, stdout}) => {
                        if (stderr) {
                            spinner.fail(stderr);
                        } else {
                            spinner.succeed(stdout);
                        }
                    }).catch(e => {
                        spinner.fail(e);
                    });
            }
        });
    }

    refreshConsole(): void {
        console.clear();
        logWelly();
        const defaultCommands = {
            "c": "Clear console",
            "d": "Full deploy",
            "f": "Fast deploy"
        };

        const allCommands = {...defaultCommands, ...this.wellyRC.commands};

        Object.keys(allCommands).forEach((key: keyof typeof allCommands) => {
            let r = "";
            const value = allCommands[key];
            if (value.length > CUT_OFF) {
                r = r + value.substring(0, CUT_OFF - 3) + "...";
            } else {
                r = r + value;
            }
            const remainingChars = SPACING - r.length;
            r = r + " ".repeat(remainingChars) + chalk.gray("[" + chalk.blue(key) + "]");
            console.log(r);
        });

    }
}