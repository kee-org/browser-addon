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
  build: {
    //TODO: retest file watching in Firefox to check vite 5 fixed sourcemaps there as well as chrome
    // Fails. Can't reproduce reliably but symptom is that the sourcemap base64 data gets split across multiple lines and FF interprets the subsequent lines as invalid syntax.
    // Even when it works, Firefox is unable to handle the data json for some reason...
    //trying relative urls again...
    // Seems decent but FF devtools never updates sources or deployed files after extension is reloaded
    // - MUST MANUALLY RESTART DEVTOOLS EVERY TIME!
    //TODO: retest in chrome and use different sourcemap approach there if required
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1437937 may be a problem but unsure
    // Need to test whether beta packaging still works with the relative maps or if need to try reverting to data-uri for that
    watch: isDev
      ? {}
      : undefined,
    outDir: r("extension/dist/background"),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: true, // (isDev || isBeta) ? "inline" : false,
    lib: {
      entry: r("src/background/main.ts"),
      name: packageJson.name,
      formats: ['es']
    },
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        extend: true
      }
    },
    reportCompressedSize: false,
    minify: false
  }
});
