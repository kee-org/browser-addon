import { dirname, relative } from "path";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import UnoCSS from "unocss/vite";
import { isBeta, isDev, port, r } from "./scripts/utils";

export const sharedConfig: UserConfig = {
    root: r("src"),
    resolve: {
        alias: {
            "~/": `${r("src")}/`
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
                // },
                // {
                //     "webextension-polyfill": [["*", "browser"]]
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
                    prefix: ""
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
    // Only used in development (esbuild)
    optimizeDeps: {
        include: ["vue", "@vueuse/core"],
        exclude: ["vue-demi"]
    }
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
    // esbuild: {
    //     minifyIdentifiers: false,
    //     minifySyntax: false,
    //     minifyWhitespace: true,
    // },
    build: {
        watch: isDev
        ? {}
        : undefined,
        outDir: r("extension/dist"),
        emptyOutDir: false,
        // Ideally we'd package the sourcemaps alongside rather than
        // base64 encoding them for the beta releases since this
        // reduces overall extension package size and should decrease
        // load time a bit too. Sadly, it still doesn't look like
        // Firefox can resolve relative sourcemapurls within extensions
        // so we're stuck with inline until then.
        //sourcemap: isDev ? "inline" : isBeta ? true : false,
        sourcemap: true, // (isDev || isBeta) ? "inline" : false,
        rollupOptions: {
            //treeshake: false,
            input: {
                settings: r("src/settings/index.html"),
                popup: r("src/popup/index.html"),
                srp: r("src/dialogs/SRP.html"),
                networkAuth: r("src/dialogs/NetworkAuth.html"),
                vuePanels: r("src/panels/panels.html"),
                legacyPanels: r("src/panels/panelsLegacy.html"),
                installNotes: r("src/install-notes/index.html"),
                updateNotes: r("src/release-notes/update-notes.html")
            }
            // This needs an absolute URL so is unlikely to be much
            // use within an extension
            // output: {
            //     sourcemapBaseUrl: "/blah/test/"
            // }
        },
        //modulePreload: { resolveDependencies: () => [] },
        reportCompressedSize: false,
        minify: false
    },
    test: {
        globals: true,
        environment: "node",
        cache: false
		// setupFiles: [
		// 	"../vitest.setup.js",
		// 	"jest-webextension-mock"
		// ],
        // sequence: {
        //     setupFiles: "list"
        // }
    }
}));
