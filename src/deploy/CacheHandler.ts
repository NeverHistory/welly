import {BuildOptions} from "esbuild";
import {readdirSync, readFileSync} from "fs";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import {ensureFileSync} from "fs-extra";

export class CacheHandler {

    private readonly buildOptions;

    private readonly cache;

    constructor(buildOptions: BuildOptions) {
        this.buildOptions = buildOptions;
        this.cache = CacheHandler.loadCache();
    }

    findNewZips(): string[] {
        // readdirSync(this.buildOptions.outdir, {withFileTypes: true})
        //     .filter(dirent => path.extname(dirent.name) === ".zip")
        //     .forEach(dirent => {
        //
        //     });

        return ["h"];
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
}