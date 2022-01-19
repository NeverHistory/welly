import {BuildOptions} from "esbuild";
import {readdirSync, readFileSync} from "fs";
import path, {dirname, sep} from "path";
import {fileURLToPath} from "url";
import {ensureFileSync} from "fs-extra";
import {createHash} from "crypto";

export class CacheHandler {

    private readonly buildOptions;

    private readonly cache;

    constructor(buildOptions: BuildOptions) {
        this.buildOptions = buildOptions;
        this.cache = CacheHandler.loadCache();
    }

    private static loadCache(): { [zipFile: string]: string } {
        const __filename = fileURLToPath(import.meta.url);
        const dirName = dirname(__filename);
        const zips = `${dirName}/.cache/zips.json`;
        ensureFileSync(zips);

        let cache = JSON.parse(readFileSync(zips, "utf-8"));

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
                if (!this.cache[dirent.name]) {
                    return dirent.name;
                }

                const hash = CacheHandler.generateHashOfZip(`${this.buildOptions.outdir}${sep}${dirent.name}`);

                if (!(this.cache[dirent.name] == hash)) {
                    return dirent.name;
                }

            });
    }
}