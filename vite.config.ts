import { dirname, relative } from "path";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import UnoCSS from "unocss/vite";
import { isDev, port, r } from "./scripts/utils";

export const sharedConfig: UserConfig = {
    root: r("src"),
    resolve: {
        alias: {
            "~/": `${r("src")}/`
            // vue: "@vue/compat/dist/vue.esm-bundler.js"
        }
    },
    define: {
        __DEV__: isDev,
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
    },
    plugins: [
        Vue({
            template: {
                compilerOptions: {

                }
            }
        }),

        AutoImport({
            imports: [
                "vue",
                {
                    "~/common/DollarPolyfills": ["$$", "$", "$STR", "$STRF"]
                },
                {
                    "webextension-polyfill": [["*", "browser"]]
                }
            ],
            dts: r("src/auto-imports.d.ts")
        }),

        // https://github.com/antfu/unplugin-vue-components
        Components({
            dirs: [r("src/components")],
            // generate `components.d.ts` for ts support with Volar
            dts: r("src/components.d.ts"),
            resolvers: [
                // auto import icons
                IconsResolver({
                    componentPrefix: ""
                })
            ]
        }),

        // https://github.com/antfu/unplugin-icons
        Icons({ compiler: "vue3" }),

        // https://github.com/unocss/unocss
        UnoCSS(),

        // rewrite assets to use relative path
        {
            name: "assets-rewrite",
            enforce: "post",
            apply: "build",
            transformIndexHtml(html, { path }) {
                return html.replace(/"\/assets\//g, `"${relative(dirname(path), "/assets")}/`);
            }
        }
    ],
    optimizeDeps: {
        include: ["vue", "@vueuse/core", "webextension-polyfill"],
        exclude: ["vue-demi"]
    },
};

export default defineConfig(({ command }) => ({
    ...sharedConfig,
    base: command === "serve" ? `http://localhost:${port}/` : "/dist/",
    server: {
        port,
        strictPort: true, // otherwise can be stuck looking at old instances
        hmr: {
            host: "localhost"
        }
    },
    esbuild: {
        treeShaking: false,
        minifyIdentifiers: false,
        minifySyntax: false,
        minifyWhitespace: true,
        sourcemap: "inline",
    },
    build: {
        outDir: r("extension/dist"),
        emptyOutDir: false,
        sourcemap: isDev ? "inline" : false,
        rollupOptions: {
            input: {
                background: r("src/background/index.html"),
                settings: r("src/settings/index.html"),
                popup: r("src/popup/index.html"),
                srp: r("src/dialogs/SRP.html"),
                networkAuth: r("src/dialogs/NetworkAuth.html"),
                vuePanels: r("src/panels/panels.html"),
                legacyPanels: r("src/panels/panelsLegacy.html")
            }
        },
        reportCompressedSize: false,
        minify: !isDev,
    },
    test: {
        globals: true,
        environment: "node"
    }
}));
