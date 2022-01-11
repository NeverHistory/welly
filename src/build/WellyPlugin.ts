import {Plugin, PluginBuild} from "esbuild/lib/main.js";
import {createWriteStream, readdirSync, renameSync} from "fs";
import {ensureDirSync} from "fs-extra";
import {sep} from "path";
import {logger} from "../lib/logger.js";
import {KeyInterface} from "./KeyInterface.js";
import archiver from "archiver";
import chalk from "chalk";

export const WellyPlugin: Plugin = {
    name: "WellyPlugin",
    setup(build) {
        build.onEnd(() => {
            if (build.initialOptions.watch) {
                const CLI = new KeyInterface(build.initialOptions);
                CLI.refreshConsole();
                CLI.listen();
            }
            handleSingleFile(build);
            zipDirs(build);

        });
    },
};

function handleSingleFile(build: PluginBuild): void {
    const files = readdirSync(build.initialOptions.outdir, {withFileTypes: true});
    if (files.length === 1) {
        ensureDirSync(`${build.initialOptions.outdir}${sep}lambda`);
        renameSync(`${build.initialOptions.outdir}${sep}${files[0].name}`,
            `${build.initialOptions.outdir}${sep}lambda${sep}${files[0].name}`);
    }
}

function zipDirs(build: PluginBuild): void {
    Promise.all(readdirSync(build.initialOptions.outdir, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .map(lambdaName => {
            const outDir = `${process.cwd()}${sep}${build.initialOptions.outdir.replace(sep, "")}`;
            const pathToLambda = `${outDir}${sep}${lambdaName}`;
            return produceZip(pathToLambda, lambdaName);
        }));
}

async function produceZip(pathToLambda: string, lambdaName: string): Promise<void> {
    const output = createWriteStream(`${pathToLambda}.zip`);
    const archive = archiver("zip", {
        zlib: {level: 9}
    });

    output.on("close", function () {
        const orange = chalk.hex("#FF9900");
        logger.info(`Produced ${orange(`${lambdaName}.zip`)} with ${orange(`${archive.pointer()} bytes`)}`);
    });

    archive.on("warning", function (err) {
        if (err.code === "ENOENT") {
            logger.warn(err.message);
        } else {
            logger.error(err.message);
        }
    });
    archive.pipe(output);
    archive.directory(pathToLambda, false);
    await archive.finalize();
}