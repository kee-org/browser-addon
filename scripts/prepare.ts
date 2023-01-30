// generate stub index.html files for dev entry
import { execSync } from "child_process";
import fs from "fs-extra";
import chokidar from "chokidar";
import { isDev, log, port, r } from "./utils";

/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml() {
    const views = [
        "settings",
        "popup",
        "background"
    ];

    for (const view of views) {
        await fs.ensureDir(r(`extension/dist/${view}`));
        let data = await fs.readFile(r(`src/${view}/index.html`), "utf-8");
        data = data
            .replace('"./main.ts"', `"http://localhost:${port}/${view}/main.ts"`)
            .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>');
        await fs.writeFile(r(`extension/dist/${view}/index.html`), data, "utf-8");
        log("PRE", `stub ${view}`);
    }

    for (const dialog of ["SRP", "NetworkAuth"]) {
        await fs.ensureDir(r(`extension/dist/dialogs/${dialog}`));
        let data = await fs.readFile(r(`src/dialogs/${dialog}.html`), "utf-8");
        data = data
            .replace(`"./${dialog}.ts"`, `"http://localhost:${port}/dialogs/${dialog}.ts"`)
            .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>');
        await fs.writeFile(r(`extension/dist/dialogs/${dialog}.html`), data, "utf-8");
        log("PRE", `stub ${dialog}`);
    }

    for (const panel of ["panels", "panelsLegacy"]) {
        await fs.ensureDir(r(`extension/dist/panels/${panel}`));
        let data = await fs.readFile(r(`src/panels/${panel}.html`), "utf-8");
        data = data
            .replace(`"./main.ts"`, `"http://localhost:${port}/panels/main.ts"`)
            .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>');
        await fs.writeFile(r(`extension/dist/panels/${panel}.html`), data, "utf-8");
        log("PRE", `stub ${panel}`);
    }

    for (const ia of ["install", "update"]) {
        await fs.ensureDir(r(`extension/dist/release-notes/${ia}`));
        let data = await fs.readFile(r(`src/release-notes/${ia}-notes.html`), "utf-8");
        data = data
            .replace(`"./${ia}.ts"`, `"http://localhost:${port}/release-notes/${ia}.ts"`)
            .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>');
        await fs.writeFile(r(`extension/dist/release-notes/${ia}-notes.html`), data, "utf-8");
        log("PRE", `stub ${ia}-notes`);
    }
}

function writeManifest() {
    execSync("npx esno ./scripts/manifest.ts", { stdio: "inherit" });
}
function writeAssets() {
    execSync("npx esno ./scripts/assets.ts", { stdio: "inherit" });
}
function writeLocales() {
    execSync("npx esno ./scripts/locales.ts", { stdio: "inherit" });
}
function writeJavascriptLibs() {
    execSync("npx esno ./scripts/jsLibs.ts", { stdio: "inherit" });
}

writeManifest();
writeAssets();
writeLocales();
writeJavascriptLibs();

if (isDev) {
    stubIndexHtml();
    chokidar.watch(r("src/**/*.html"))
        .on("change", () => {
            stubIndexHtml();
        });
    chokidar.watch([r("src/manifest.ts"), r("package.json")])
        .on("change", () => {
            writeManifest();
        });
    chokidar.watch(r("src/assets/**/*")).on("change", () => {
        writeAssets();
    });
    chokidar.watch(r("_locales/**/*")).on("change", () => {
        writeLocales();
    });
    chokidar.watch(r("lib/*")).on("change", () => {
        writeJavascriptLibs();
    });
}
