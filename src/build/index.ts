import {build} from "esbuild/lib/main.js";
import {sep} from "path";
import {entryDir} from "./EntryDir.js";
import {WellyPlugin} from "./WellyPlugin.js";

interface BuildProps {
    watch?: boolean;
}

export function runBuild(props: BuildProps): void {

    build({
        entryPoints: entryDir("src/", ["lib"], ["index.ts"]),
        plugins: [WellyPlugin],
        outdir: `dist${sep}`,
        platform: "node",
        bundle: true,
        minify: false,
        watch: !!props.watch,
        treeShaking: true,
        tsconfig: "tsconfig.json"
    });
}