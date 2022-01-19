import {build} from "esbuild/lib/main.js";
import {sep} from "path";
import {entryDir} from "./EntryDir.js";
import {WellyPlugin} from "./WellyPlugin.js";
import {loadWellyRC} from "../lib/wellyRC.js";

interface BuildProps {
    watch?: boolean;
}


export function runBuild(props: BuildProps): void {
    const wellyRC = loadWellyRC();

    build({
        outdir: `dist${sep}`,
        entryPoints: entryDir("src/", ["lib"], ["index.ts"]),
        platform: "node",
        watch: !!props.watch,
        treeShaking: true,
        tsconfig: "tsconfig.json",
        bundle: true,
        minify: !props.watch,
        // this will override everything before this point if set
        ...wellyRC.build,
        plugins: wellyRC.build.plugins.length > 0 ? [WellyPlugin].concat(wellyRC.build.plugins) : [WellyPlugin],
    });
}