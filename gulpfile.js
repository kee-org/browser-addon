/* eslint-disable no-undef */
/* eslint-disable no-var */
var gulp = require("gulp");
var eslint = require("gulp-eslint");
var fs = require("fs");
var gulpZip = require("gulp-zip");
var merge = require("merge-stream");
var del = require("del");
var replace = require("gulp-replace");
var signAddon = require("sign-addon").default;
var rollup = require("rollup");
var resolve = require("@rollup/plugin-node-resolve");
var typescript = require("rollup-plugin-typescript2");
var terser = require("rollup-plugin-terser").terser;
var vue = require("rollup-plugin-vue");
var commonjs = require("rollup-plugin-commonjs");
var rollupReplace = require("rollup-plugin-replace");
var iife = require("rollup-plugin-iife");
var url = require("@rollup/plugin-url");
var copy = require("rollup-plugin-copy");

// Some tasks set DEBUG to false so that a production build can be executed.
// There doesn't appear to be a way to pass this as a local variable so we
// have to ensure every invocation of gulp only builds in either production
// or debug mode but not both (tasks run concurrently)
var DEBUG = true;
var WATCH = true;

const buildDirDebug = "build/debug/all";
const buildDirProd = "build/prod/all";
const buildDirDebugFirefox = "build/debug/firefox";
const buildDirProdFirefox = "build/prod/firefox";
const buildDirDebugChrome = "build/debug/chrome";
const buildDirProdChrome = "build/prod/chrome";
const globStaticManifest = "manifest.json";
const globStaticLocales = "_locales/**";
const globStaticReleaseNotes = "release-notes/*.{js,css,html,map}";
const globStaticCommonFonts = "common/fonts/**";
const globStaticCommonImages = "common/images/**";
const globStaticCommon = "common/*.{css,html}";
const globStaticLib = "lib/**/*.*";
const globStaticDialogs = "dialogs/*.{css,html}";
const globStaticSettings = "settings/*.{css,html}";
const globStaticBackground = "background/*.{css,html}";
const globStaticPage = "page/*.{css,html}";
const globStaticPanels = "panels/*.{css,html}";
const globStaticPopup = "popup/*.{css,html}";


/********** CLEANING **********/

// Assumes inclusions and exclusions are the same for all browsers
var deleteBuildFiles = function (includeGlobs, excludeGlobs) {
    var globs = [];
    for (const g of includeGlobs) {
        if (DEBUG) {
            globs.push(buildDirDebug + "/" + g);
            globs.push(buildDirDebugFirefox + "/" + g);
            globs.push(buildDirDebugChrome + "/" + g);
        } else {
            globs.push(buildDirProd + "/" + g);
            globs.push(buildDirProdFirefox + "/" + g);
            globs.push(buildDirProdChrome + "/" + g);
        }
    }
    if (excludeGlobs) for (const g of excludeGlobs) {
        if (DEBUG) {
            globs.push("!" + buildDirDebug + "/" + g);
            globs.push("!" + buildDirDebugFirefox + "/" + g);
            globs.push("!" + buildDirDebugChrome + "/" + g);
        } else {
            globs.push("!" + buildDirProd + "/" + g);
            globs.push("!" + buildDirProdFirefox + "/" + g);
            globs.push("!" + buildDirProdChrome + "/" + g);
        }
    }
    return del(globs);
};

gulp.task("clean:ts", function cleanTS () {
    return deleteBuildFiles([], ["lib"]);
});

gulp.task("clean:static:popup", function cleanStaticPopup () {
    return deleteBuildFiles([globStaticPopup]);
});
gulp.task("clean:static:panels", function cleanStaticPanels () {
    return deleteBuildFiles([globStaticPanels]);
});
gulp.task("clean:static:page", function cleanStaticPage () {
    return deleteBuildFiles([globStaticPage]);
});
gulp.task("clean:static:background", function cleanStaticBackground () {
    return deleteBuildFiles([globStaticBackground]);
});
gulp.task("clean:static:settings", function cleanStaticSettings () {
    return deleteBuildFiles([globStaticSettings]);
});
gulp.task("clean:static:dialogs", function cleanStaticDialogs () {
    return deleteBuildFiles([globStaticDialogs]);
});
gulp.task("clean:static:lib", function cleanStaticLib () {
    return deleteBuildFiles([globStaticLib]);
});
gulp.task("clean:static:common", function cleanStaticCommon () {
    return deleteBuildFiles([globStaticCommon]);
});
gulp.task("clean:static:commonImages", function cleanStaticCommonImages () {
    return deleteBuildFiles([globStaticCommonImages]);
});
gulp.task("clean:static:commonFonts", function cleanStaticCommonFonts () {
    return deleteBuildFiles([globStaticCommonFonts]);
});
gulp.task("clean:static:releasenotes", function cleanStaticReleaseNotes () {
    return deleteBuildFiles([globStaticReleaseNotes]);
});
gulp.task("clean:static:locales", function cleanStaticLocales () {
    return deleteBuildFiles([globStaticLocales]);
});
gulp.task("clean:static:manifest", function cleanStaticManifest () {
    return deleteBuildFiles([globStaticManifest]);
});

gulp.task("clean", gulp.parallel(
    "clean:static:manifest", "clean:static:locales", "clean:static:releasenotes",
    "clean:static:commonFonts", "clean:static:commonImages",
    "clean:static:common", "clean:static:dialogs", "clean:static:settings",
    "clean:static:background", "clean:static:page", "clean:static:panels",
    "clean:static:popup", "clean:ts"
));

gulp.task("sign", function sign (done) {
    const manifest = require("./manifest");
    const distFileName = manifest.name + "-v" + manifest.version + "-debug.xpi";

    //TODO:4: If API output is suitable, derive these file names from that in case Mozilla change file naming conventions one day
    fs.writeFileSync(".signedKeeXPI", "kee_password_manager-" + manifest.version + "beta-an+fx.xpi");
    fs.writeFileSync(".downloadLinkKeeXPI", "https://github.com/kee-org/browser-addon/releases/download/"
        + manifest.version + "/kee_password_manager-" + manifest.version + "beta-an+fx.xpi");

    signAddon({
        xpiPath: "dist/" + distFileName,
        version: manifest.version + "beta",
        apiKey: process.env.AMO_API_KEY,
        apiSecret: process.env.AMO_API_SECRET,
        id: "keefox@chris.tomlinson",
        downloadDir: "dist/signed/",
        channel: "unlisted"
    })
        .then(function (result) {
            if (result.success) {
                console.log("The following signed files were downloaded:");
                console.log(result.downloadedFiles);
                console.log("Reported file name: ");
                if (result.downloadedFiles && result.downloadedFiles.length > 0) console.log(result.downloadedFiles[0]);
            } else {
                console.error("add-on could not be signed!");
                console.error("Check the console for details.");
            }
            console.log(result.success ? "SUCCESS" : "FAIL");
        })
        .catch(function (error) {
            console.error("Signing error:", error);
        });

    done();
});


/********** LINTING TYPESCRIPT **********/

gulp.task("lint:ts",
// ["lint:background", "lint:popup", "lint:panels", "lint:page", "lint:vault", "lint:settings", "lint:dialogs" ],
    gulp.series(function lintTs () {
        return gulp.src(["**/*.ts", "!node_modules/**/*.ts", "!typedefs/**/*.ts"])
            // eslint() attaches the lint output to the "eslint" property
            // of the file object so it can be used by other modules.
            .pipe(eslint())
            // eslint.format() outputs the lint results to the console.
            // Alternatively use eslint.formatEach() (see Docs).
            .pipe(eslint.format())
            // To have the process exit with an error code (1) on
            // lint error, return the stream and pipe to failAfterError last.
            .pipe(eslint.failAfterError());
    }));

/********** COMPILING TYPESCRIPT **********/

gulp.task("watchts", gulp.series(gulp.parallel("clean:ts", "lint:ts"), function watchTs () {
    return executeRollup();
}));

gulp.task("compilets:all", gulp.series(gulp.parallel("clean:ts", "lint:ts"), function compileTsAll () {
    return executeRollup();
}));

var executeRollup = function () {

    const plugins = [
        resolve(),
        commonjs(),
        rollupReplace({
            "strict: true, //__VUEX_STRICT_CONFIG__": WATCH ? "strict: true," : ""
        }),
        typescript({
            clean: true,
            tsconfig: "tsconfig.json",
            typescript: require("typescript")
        }),
        iife(),
        rollupReplace({
            "process.env.NODE_ENV": JSON.stringify( DEBUG ? "development" : "production" )
        }),
        vue({
            needMap: false // buggy so must be disabled to get sourcemaps to work at all
        }),
        // hack to allow images to load, until they don't. can't find any way to get rollup to just let images work without such hacks...
        url({
            limit: 1024 * 1024, // inline files < 1M, copy files > 1M //TODO 4K
            //include: ["**/*.svg"], // defaults to .svg, .png, .jpg and .gif files
            emitFiles: true // defaults to true
        }),
        copy({
            targets: [
                { src: "node_modules/vue/dist/vue.runtime.min.js", dest: "lib/pkg" },
                { src: "node_modules/vuex/dist/vuex.min.js", dest: "lib/pkg" },
                { src: "node_modules/vuetify/dist/vuetify.min.js", dest: "lib/pkg" },
                { src: "node_modules/vuetify/dist/vuetify.min.css", dest: "lib/css" }
            ]
        })
    ];
    if (!DEBUG) plugins.push(terser());

    var input = {
        external: ["vue","vueex","vuetify"],
        input: {
            "vault/vault": "./vault/vault.ts",
            "background/background": "./background/background.ts",
            "popup/popup": "./popup/popup.ts",
            "settings/settings": "./settings/settings.ts",
            "panels/panels": "./panels/panels.ts",
            "page/page": "./page/page.ts",
            "dialogs/SRP": "./dialogs/SRP.ts",
            "dialogs/NetworkAuth": "./dialogs/NetworkAuth.ts"
        },
        plugins,
        manualChunks (id) {
            //console.log(id);
            if (id.includes("/browser-addon/common/") ||
            id.includes("/browser-addon/store/")
            ) {
                return "common";
            }
        },
        onwarn: function (warning) {
            console.warn( (warning.loc ? warning.loc.file : "") + ":" + (warning.loc ? warning.loc.line : "") + ":"
            + (warning.loc ? warning.loc.column : "") + " " + warning.message + "\n" + warning.frame );
        }
    };
    const output = {
        format: "es",
        sourcemap: !!DEBUG,
        globals: { // maps external modules above to specific global vars
            vue: "Vue",
            vuetify: "Vuetify"
        },
        chunkFileNames: "common/[name].js"
    };
    if (WATCH) {
        const watcher = rollup.watch({
            ...input,
            output: [Object.assign({dir: buildDirDebug }, output)],
            watch: {
                clearScreen: false
            }
        });
        watcher.on("event", event => {
            if (event.code === "START" || event.code === "END" || event.code === "ERROR" || event.code === "FATAL")
                console.info(`WATCHER: ${event.code} : ${JSON.stringify(event)}`);
        });
        return watcher;
    } else {
        return rollup.rollup(input).then(bundle => Promise.all([
            bundle.write(Object.assign({dir: DEBUG ? buildDirDebug : buildDirProd}, output)),
            bundle.write(Object.assign({dir: DEBUG ? buildDirDebugChrome : buildDirProdChrome}, output)),
            bundle.write(Object.assign({dir: DEBUG ? buildDirDebugFirefox : buildDirProdFirefox}, output))
        ]));
    }
};

/********** STATIC FILE COPYING / MANIPULATION **********/

var copyStatic = function (glob, dir) {
    if (WATCH) {
        return gulp.src(glob)
            .pipe(replace("<!--__VUE_DEV_TOOLS_PLACEHOLDER__-->", DEBUG ? "<script src='https://localhost:8099'></script>" : ""))
            .pipe(gulp.dest((DEBUG ? buildDirDebug : buildDirProd) + dir));
    } else {
        return gulp.src(glob)
            .pipe(replace("<!--__VUE_DEV_TOOLS_PLACEHOLDER__-->", DEBUG ? "<script src='https://localhost:8099'></script>" : ""))
            .pipe(gulp.dest((DEBUG ? buildDirDebug : buildDirProd) + dir))
            .pipe(gulp.dest((DEBUG ? buildDirDebugFirefox : buildDirProdFirefox) + dir))
            .pipe(gulp.dest((DEBUG ? buildDirDebugChrome : buildDirProdChrome) + dir));
    }
};

gulp.task("static:popup", gulp.series("clean:static:popup", function staticPopup () {
    return copyStatic(globStaticPopup, "/popup");
}));
gulp.task("static:panels", gulp.series("clean:static:panels", function staticPanels () {
    return copyStatic(globStaticPanels, "/panels");
}));
gulp.task("static:page", gulp.series("clean:static:page", function staticPage () {
    return copyStatic(globStaticPage, "/page");
}));
gulp.task("static:background", gulp.series("clean:static:background", function staticBackground () {
    return copyStatic(globStaticBackground, "/background");
}));
gulp.task("static:settings", gulp.series("clean:static:settings", function staticSettings () {
    return copyStatic(globStaticSettings, "/settings");
}));
gulp.task("static:dialogs", gulp.series("clean:static:dialogs", function staticDialogs () {
    return copyStatic(globStaticDialogs, "/dialogs");
}));
gulp.task("static:lib", gulp.series("clean:static:lib", function staticLib () {
    return copyStatic(globStaticLib, "/lib");
}));
gulp.task("static:common", gulp.series("clean:static:common", function staticCommon () {
    return copyStatic(globStaticCommon, "/common");
}));
gulp.task("static:commonFonts", gulp.series("clean:static:commonFonts", function staticCommonFonts () {
    return copyStatic(globStaticCommonFonts, "/common/fonts");
}));
gulp.task("static:commonImages", gulp.series("clean:static:commonImages", function staticCommonImages () {
    return copyStatic(globStaticCommonImages, "/common/images");
}));
gulp.task("static:releasenotes", gulp.series("clean:static:releasenotes", function staticReleaseNotes () {
    return copyStatic(globStaticReleaseNotes, "/release-notes");
}));
gulp.task("static:locales", gulp.series("clean:static:locales", function staticLocales () {
    return copyStatic(globStaticLocales, "/_locales");
}));

gulp.task("copyStaticManifest", gulp.series(function copyStaticManifest () {
    return copyStatic(globStaticManifest, "");
}));

gulp.task("modifyBuildFilesForCrossBrowser", gulp.series(function modifyBuildFilesForCrossBrowser () {
    if (DEBUG) {
        console.log("Modifying manifest for cross-browser debug");
        return merge (
            gulp.src([buildDirDebugFirefox + "/manifest.json"])
                .pipe(replace("\"content_security_policy\": \"script-src 'self' https://localhost:8099; object-src 'self';\",", ""))
                .pipe(replace(/(.*"version": ")(.*)(",.*)/g, "$1$2beta$3"))
                .pipe(replace(/(.*"version_name": ")(.*)(",.*)/g, ""))
                .pipe(gulp.dest(buildDirDebugFirefox)),
            gulp.src([buildDirDebugChrome + "/manifest.json"])
                .pipe(replace("\"content_security_policy\": \"script-src 'self' https://localhost:8099; object-src 'self';\",", ""))
                .pipe(replace(/(.*"version_name": ")(.*)(",.*)/g, "$1$2 Beta$3"))
                .pipe(replace(/(,[\s]*?)"applications": ([\S\s]*?}){2}/g, ""))
            // hack to workaround https://github.com/mozilla/webextension-polyfill/issues/70 :
                .pipe(replace(/(.*"clipboardWrite",)(.*)/g, ""))
                .pipe(replace(/(.*"clipboardRead",)(.*)/g, ""))
                .pipe(gulp.dest(buildDirDebugChrome))
        );
    } else {
        console.log("Modifying manifest for cross-browser production");
        return merge (
            gulp.src([buildDirProdFirefox + "/manifest.json"])
                .pipe(replace("\"content_security_policy\": \"script-src 'self' https://localhost:8099; object-src 'self';\",", ""))
                .pipe(replace(/(.*"version_name": ")(.*)(",.*)/g, ""))
                .pipe(replace(/(.*"update_url": ")(.*)(",.*)/g, ""))
                .pipe(gulp.dest(buildDirProdFirefox)),
            gulp.src([buildDirProdChrome + "/manifest.json"])
                .pipe(replace("\"content_security_policy\": \"script-src 'self' https://localhost:8099; object-src 'self';\",", ""))
                .pipe(replace(/(,[\s]*?)"applications": ([\S\s]*?}){2}/g, ""))
            // hack to workaround https://github.com/mozilla/webextension-polyfill/issues/70 :
                .pipe(replace(/(.*"clipboardWrite",)(.*)/g, ""))
                .pipe(replace(/(.*"clipboardRead",)(.*)/g, ""))
                .pipe(gulp.dest(buildDirProdChrome))
        );
    }
}));

gulp.task("static:manifest", gulp.series("clean:static:manifest", function staticManifest (done) {
    if (WATCH) gulp.series("copyStaticManifest")();
    else gulp.series("copyStaticManifest", "modifyBuildFilesForCrossBrowser")();
    done();
}));

gulp.task("static", gulp.parallel("static:popup","static:panels","static:page","static:background",
    "static:settings","static:dialogs","static:common","static:commonFonts",
    "static:commonImages","static:releasenotes","static:locales",
    "static:manifest", "static:lib"));

/********** WATCHING FOR CHANGES TO SOURCE FILES **********/

function watch () {
    gulp.watch([globStaticPopup], ["static:popup"]);
    gulp.watch([globStaticPanels], ["static:panels"]);
    gulp.watch([globStaticPage], ["static:page"]);
    gulp.watch([globStaticBackground], ["static:background"]);
    gulp.watch([globStaticSettings], ["static:settings"]);
    gulp.watch([globStaticDialogs], ["static:dialogs"]);
    gulp.watch([globStaticLib], ["static:lib"]);
    gulp.watch([globStaticCommon], ["static:common"]);
    gulp.watch([globStaticCommonFonts], ["static:commonFonts"]);
    gulp.watch([globStaticCommonImages], ["static:commonImages"]);
    gulp.watch([globStaticReleaseNotes], ["static:releasenotes"]);
    gulp.watch([globStaticLocales], ["static:locales"]);
    gulp.watch([globStaticManifest], ["static:manifest"]);
}

gulp.task("watch", gulp.series(gulp.parallel("watchts", "static"), watch));

/********** PACKAGING **********/

gulp.task("zip", function zip () {
    var manifest = require("./manifest");
    var distFileName = manifest.name + "-v" + manifest.version + ".zip";
    console.log(buildDirProdChrome);
    console.log("ok");
    return gulp.src(buildDirProdChrome + "/**")
        .pipe(gulpZip(distFileName))
        .pipe(gulp.dest("dist"));
});

gulp.task("xpi", function xpi () {
    var manifest = require("./manifest");
    var distFileName = manifest.name + "-v" + manifest.version + ".xpi";
    return gulp.src(buildDirProdFirefox + "/**")
        .pipe(gulpZip(distFileName))
        .pipe(gulp.dest("dist"));
});

gulp.task("zip:debug", function zipDebug () {
    var manifest = require("./manifest");
    var distFileName = manifest.name + "-v" + manifest.version + "-debug.zip";
    return gulp.src(buildDirDebugChrome + "/**")
        .pipe(gulpZip(distFileName))
        .pipe(gulp.dest("dist"));
});

gulp.task("xpi:debug", function xpiDebug () {
    var manifest = require("./manifest");
    var distFileName = manifest.name + "-v" + manifest.version + "-debug.xpi";
    return gulp.src(buildDirDebugFirefox + "/**")
        .pipe(gulpZip(distFileName))
        .pipe(gulp.dest("dist"));
});


/********** TOP-LEVEL ORCHESTRATION **********/


gulp.task("compilets", gulp.series("compilets:all"));

gulp.task("build:debug", gulp.series(function buildDebug (done) {
    WATCH = false;
    done();
}, "compilets", "static"));
gulp.task("build:prod", gulp.series(function buildProd (done) {
    DEBUG = false;
    WATCH = false;
    done();
}, "compilets", "static"));

gulp.task("package:prod", gulp.series(function packageProd (done) {
    DEBUG = false;
    WATCH = false;
    done();
},
gulp.parallel("compilets", "static"),
gulp.parallel("xpi","zip")
));

gulp.task("package:debug", gulp.series(function packageDebug (done) {
    WATCH = false;
    done();
},
gulp.parallel("compilets", "static"),
gulp.parallel("xpi:debug","zip:debug")
));

gulp.task("default", gulp.series("build:debug"));
gulp.task("build", gulp.series("build:debug"));
