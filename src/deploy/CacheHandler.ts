import {BuildOptions} from "esbuild";
import {existsSync, readdirSync, readFileSync} from "fs";
import path, {dirname, sep} from "path";
import {createHash} from "crypto";
import {logger} from "../lib/logger.js";
import legacy_CJS from "fs-extra";
import {fileURLToPath} from "url";

const {ensureFileSync} = legacy_CJS;

export class CacheHandler {

    private readonly buildOptions;
    private readonly cache;

    constructor(buildOptions: BuildOptions) {
        this.buildOptions = buildOptions;
        this.cache = CacheHandler.loadCache();
    }

    private static loadCache(): { [zipFile: string]: string } {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const zips = `${__dirname}/.cache/zips.json`;

        let cache ={};
        if (existsSync(zips)) {
            cache = JSON.parse(readFileSync(zips, "utf-8"));
        }else{
            ensureFileSync(zips);
        }

        if (!cache) {
            cache = {};
        }

        return cache;
    }

    private static generateHashOfZip(pathToZip: string): string {
        return createHash("MD5").update(readFileSync(pathToZip)).digest("hex");
    }

    findNewZips(): string[] {
        return readdirSync(this.buildOptions.outdir, {withFileTypes: true})
            .filter(dirent => path.extname(dirent.name) === ".zip")
            .map(dirent => {
                const filePath = `${process.cwd()}${sep}${this.buildOptions.outdir}${sep}${dirent.name}`;
                if (!this.cache[dirent.name]) {
                    return filePath;
                }

                const hash = CacheHandler.generateHashOfZip(`${this.buildOptions.outdir}${sep}${dirent.name}`);
                logger.debug("Hash: " + hash);
                if (this.cache[dirent.name] != hash) {
                    return filePath;
                }

            });
    }
}
