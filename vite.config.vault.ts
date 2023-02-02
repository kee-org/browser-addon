import { defineConfig } from "vite";
import { sharedConfig } from "./vite.config";
import { isBeta, isDev, r } from "./scripts/utils";
import packageJson from "./package.json";

// bundling the content script using Vite
export default defineConfig({
    ...sharedConfig,
    define: {
        "__DEV__": isDev,
        // https://github.com/vitejs/vite/issues/9320
        // https://github.com/vitejs/vite/issues/9186
        "process.env.NODE_ENV": JSON.stringify(isDev ? "development" : "production")
    },
    // esbuild: {
    //     minifyIdentifiers: false,
    //     minifySyntax: false,
    //     minifyWhitespace: true,
    // },
    build: {
        watch: isDev
            ? {}
            : undefined,
        outDir: r("extension/dist/vault"),
        cssCodeSplit: false,
        emptyOutDir: false,
        sourcemap: (isDev || isBeta) ? "inline" : false,
        lib: {
            entry: r("src/vault/vault.ts"),
            name: packageJson.name,
            formats: ["iife"]
        },
        rollupOptions: {
            output: {
                entryFileNames: "index.global.js",
                extend: true,
            }
        },
        reportCompressedSize: false,
        minify: false,
    }
});
