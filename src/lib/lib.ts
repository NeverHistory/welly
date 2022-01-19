import {promisify} from "util";
import {exec} from "child_process";
import {logger} from "./logger.js";

export const proc = promisify(exec);

export async function spinnerProc(logMessage: string, cmd: string, cwd: string): Promise<void> {
    const spinner = logger.loading(logMessage);
    await proc(cmd, {cwd: cwd}).then(({stderr, stdout}) => {
        if (stderr) {
            spinner.fail(stderr);
        } else {
            spinner.succeed(stdout);
        }
    }).catch(e => spinner.fail(e.message));
}
