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
    watch: isDev
      ? {}
      : undefined,
    outDir: r("extension/dist/background"),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: (isDev || isBeta) ? "inline" : false,
    lib: {
      entry: r("src/background/main.ts"),
      name: packageJson.name
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
