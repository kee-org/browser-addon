var gulp = require("gulp");
var tslint = require("gulp-tslint");
var fs = require("fs");
var zip = require('gulp-zip');
var merge = require('merge-stream');
var sequence = require('run-sequence');
var del = require('del');
var replace = require('gulp-replace');
var signAddon = require('sign-addon').default;
var rollup = require('rollup');
var resolve = require('rollup-plugin-node-resolve');
var typescript = require('rollup-plugin-typescript2');
var terser = require('rollup-plugin-terser').terser;
var vue = require('rollup-plugin-vue');
var commonjs = require('rollup-plugin-commonjs');
var rollupReplace = require('rollup-plugin-replace');
var iife = require('rollup-plugin-iife');

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
const globStaticManifest = 'manifest.json';
const globStaticLocales = '_locales/**';
const globStaticReleaseNotes = 'release-notes/*.{js,css,html,map}';
const globStaticCommonFonts = 'common/fonts/**';
const globStaticCommonImages = 'common/images/**';
const globStaticCommon = 'common/*.{css,html}';
const globStaticLib = 'lib/**/*.*';
const globStaticDialogs = 'dialogs/*.{css,html}';
const globStaticSettings = 'settings/*.{css,html}';
const globStaticBackground = 'background/*.{css,html}';
const globStaticPage = 'page/*.{css,html}';
const globStaticPanels = 'panels/*.{css,html}';
const globStaticPopup = 'popup/*.{css,html}';


/********** TOP-LEVEL ORCHESTRATION **********/

gulp.task('default', ['build:debug']);
gulp.task('build', ['build:debug']);

gulp.task('build:debug', function (done) {
    WATCH = false;
    sequence(['compilets', 'static'], done);
});
gulp.task('build:prod', function (done) {
    DEBUG = false;
    WATCH = false;
    sequence(['compilets', 'static'], done);
});

gulp.task("compilets", function (done) {
    sequence("compilets:all", done);
});

/********** LINTING TYPESCRIPT **********/

gulp.task("lint:ts",
// ["lint:background", "lint:popup", "lint:panels", "lint:page", "lint:vault", "lint:settings", "lint:dialogs" ],
function() {
    return gulp.src(["**/*.ts", "!node_modules/**/*.ts", "!typedefs/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

/********** COMPILING TYPESCRIPT **********/

gulp.task("watchts", ["clean:ts", "lint:ts"], function() {
    return executeRollup();
});

gulp.task("compilets:all", ["clean:ts", "lint:ts"], function() {
    return executeRollup();
});

var executeRollup = function () {

    const plugins = [
        resolve(),
        commonjs(),
        typescript({
            clean: true,
            tsconfig: 'tsconfig.json',
            typescript: require('typescript')
        }),
        iife(),
        rollupReplace({
            'process.env.NODE_ENV': JSON.stringify( DEBUG ? 'development' : 'production' )
          }),
        vue({
            needMap: false // buggy so must be disabled to get sourcemaps to work at all
        })
    ];
    if (!DEBUG) plugins.push(terser());

    var input = {
        //external: ['vue','vueex'],
        input: {
            'vault/vault': './vault/vault.ts',
            'background/background': './background/background.ts',
            'popup/popup': './popup/popup.ts',
            'settings/settings': './settings/settings.ts',
            'panels/panels': './panels/panels.ts',
            'page/page': './page/page.ts',
            'dialogs/SRP': './dialogs/SRP.ts',
            'dialogs/NetworkAuth': './dialogs/NetworkAuth.ts'
        },
        plugins,
        manualChunks(id) {
            if (id.includes('common/')) {
              return 'common';
            }
        },
        onwarn: function(warning) {
            console.warn( warning.loc.file + ':' + warning.loc.line + ':' + warning.loc.column + ' ' + warning.message + '\n' + warning.frame );
        }
    };
    const output = {
        format: "es",
        sourcemap: !!DEBUG,
        // globals: {
        //     vue: "Vue"
        // },
        chunkFileNames: "common/[name].js"
    };
    if (WATCH) {
        return rollup.watch({
            ...input,
            output: [Object.assign({dir: buildDirDebug }, output)],
            watch: {
                clearScreen: false
            }
        });
    } else {
        return rollup.rollup(input).then(bundle => {

            return Promise.all([
                    bundle.write(Object.assign({dir: DEBUG ? buildDirDebug : buildDirProd}, output)),
                    bundle.write(Object.assign({dir: DEBUG ? buildDirDebugChrome : buildDirProdChrome}, output)),
                    bundle.write(Object.assign({dir: DEBUG ? buildDirDebugFirefox : buildDirProdFirefox}, output))
                ]);
        });
    }
}

/********** STATIC FILE COPYING / MANIPULATION **********/

var copyStatic = function (glob, dir) {
    if (WATCH) {
        return gulp.src(glob)
        .pipe(replace("<!--__VUE_DEV_TOOLS_PLACEHOLDER__-->", DEBUG ? "<script src='https://localhost:8099'></script>" : ""))
        .pipe(gulp.dest((DEBUG ? buildDirDebug : buildDirProd) + dir))
    } else {
        return gulp.src(glob)
        .pipe(replace("<!--__VUE_DEV_TOOLS_PLACEHOLDER__-->", DEBUG ? "<script src='https://localhost:8099'></script>" : ""))
        .pipe(gulp.dest((DEBUG ? buildDirDebug : buildDirProd) + dir))
        .pipe(gulp.dest((DEBUG ? buildDirDebugFirefox : buildDirProdFirefox) + dir))
        .pipe(gulp.dest((DEBUG ? buildDirDebugChrome : buildDirProdChrome) + dir))
    }
}

gulp.task('static:popup', ["clean:static:popup"], function() {
    return copyStatic(globStaticPopup, '/popup');
});
gulp.task('static:panels', ["clean:static:panels"], function() {
    return copyStatic(globStaticPanels, '/panels');
});
gulp.task('static:page', ["clean:static:page"], function() {
    return copyStatic(globStaticPage, '/page');
});
gulp.task('static:background', ["clean:static:background"], function() {
    return copyStatic(globStaticBackground, '/background');
});
gulp.task('static:settings', ["clean:static:settings"], function() {
    return copyStatic(globStaticSettings, '/settings');
});
gulp.task('static:dialogs', ["clean:static:dialogs"], function() {
    return copyStatic(globStaticDialogs, '/dialogs');
});
gulp.task('static:lib', ["clean:static:lib"], function() {
    return copyStatic(globStaticLib, '/lib');
});
gulp.task('static:common', ["clean:static:common"], function() {
    return copyStatic(globStaticCommon, '/common');
});
gulp.task('static:commonFonts', ["clean:static:commonFonts"], function() {
    return copyStatic(globStaticCommonFonts, '/common/fonts');
});
gulp.task('static:commonImages', ["clean:static:commonImages"], function() {
    return copyStatic(globStaticCommonImages, '/common/images');
});
gulp.task('static:releasenotes', ["clean:static:releasenotes"], function() {
    return copyStatic(globStaticReleaseNotes, '/release-notes');
});
gulp.task('static:locales', ["clean:static:locales"], function() {
    return copyStatic(globStaticLocales, '/_locales');
});

gulp.task('copyStaticManifest', function() {
    return copyStatic(globStaticManifest, '');
});

gulp.task('modifyBuildFilesForCrossBrowser', function() {
    if (DEBUG) {
        return merge (
            gulp.src([buildDirDebugFirefox + '/manifest.json'])
            .pipe(replace("\"content_security_policy\": \"script-src 'self' https://localhost:8099; object-src 'self';\",", ""))
            .pipe(replace(/(.*"version": ")(.*)(",.*)/g, '$1$2beta$3'))
            .pipe(replace(/(.*"version_name": ")(.*)(",.*)/g, ''))
            .pipe(gulp.dest(buildDirDebugFirefox)),
            gulp.src([buildDirDebugChrome + '/manifest.json'])
            .pipe(replace("\"content_security_policy\": \"script-src 'self' https://localhost:8099; object-src 'self';\",", ""))
            .pipe(replace(/(.*"version_name": ")(.*)(",.*)/g, '$1$2 Beta$3'))
            .pipe(replace(/(,[\s]*?)"applications": ([\S\s]*?}){2}/g, ''))
            // hack to workaround https://github.com/mozilla/webextension-polyfill/issues/70 :
            .pipe(replace(/(.*"clipboardWrite",)(.*)/g, ''))
            .pipe(replace(/(.*"clipboardRead",)(.*)/g, ''))
            .pipe(gulp.dest(buildDirDebugChrome))
        );
    } else {
        return merge (
            gulp.src([buildDirProdFirefox + '/manifest.json'])
            .pipe(replace("\"content_security_policy\": \"script-src 'self' https://localhost:8099; object-src 'self';\",", ""))
            .pipe(replace(/(.*"version_name": ")(.*)(",.*)/g, ''))
            .pipe(replace(/(.*"update_url": ")(.*)(",.*)/g, ''))
            .pipe(gulp.dest(buildDirProdFirefox)),
            gulp.src([buildDirProdChrome + '/manifest.json'])
            .pipe(replace("\"content_security_policy\": \"script-src 'self' https://localhost:8099; object-src 'self';\",", ""))
            .pipe(replace(/(,[\s]*?)"applications": ([\S\s]*?}){2}/g, ''))
            // hack to workaround https://github.com/mozilla/webextension-polyfill/issues/70 :
            .pipe(replace(/(.*"clipboardWrite",)(.*)/g, ''))
            .pipe(replace(/(.*"clipboardRead",)(.*)/g, ''))
            .pipe(gulp.dest(buildDirProdChrome))
        )
    }
});

gulp.task('static:manifest', ["clean:static:manifest"], function(done) {
    if (WATCH) return sequence("copyStaticManifest", done);
    else return sequence("copyStaticManifest", "modifyBuildFilesForCrossBrowser", done);
});

gulp.task('static', ['static:popup','static:panels','static:page','static:background',
    'static:settings','static:dialogs','static:common','static:commonFonts',
    'static:commonImages','static:releasenotes','static:locales',
    'static:manifest', 'static:lib']);

/********** WATCHING FOR CHANGES TO SOURCE FILES **********/

gulp.task('watch', ['watchts', 'static'], function() {
    gulp.watch([globStaticPopup], ['static:popup']);
    gulp.watch([globStaticPanels], ['static:panels']);
    gulp.watch([globStaticPage], ['static:page']);
    gulp.watch([globStaticBackground], ['static:background']);
    gulp.watch([globStaticSettings], ['static:settings']);
    gulp.watch([globStaticDialogs], ['static:dialogs']);
    gulp.watch([globStaticLib], ['static:lib']);
    gulp.watch([globStaticCommon], ['static:common']);
    gulp.watch([globStaticCommonFonts], ['static:commonFonts']);
    gulp.watch([globStaticCommonImages], ['static:commonImages']);
    gulp.watch([globStaticReleaseNotes], ['static:releasenotes']);
    gulp.watch([globStaticLocales], ['static:locales']);
    gulp.watch([globStaticManifest], ['static:manifest']);
});

/********** PACKAGING **********/

gulp.task('zip', function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '.zip';
	return gulp.src([buildDirProdChrome + '/**'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('xpi', function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '.xpi';
	return gulp.src([buildDirProdFirefox + '/**'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('zip:debug', function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '-debug.zip';
	return gulp.src([buildDirDebugChrome + '/**'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('xpi:debug', function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '-debug.xpi';
	return gulp.src([buildDirDebugFirefox + '/**'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('package:prod', function (done) {
    DEBUG = false;
    WATCH = false;
    sequence(['compilets', 'static'], ['xpi','zip'], done);
});

gulp.task('package:debug', function (done) {
    WATCH = false;
    sequence(['compilets', 'static'], ['xpi:debug','zip:debug'], done);
});

/********** CLEANING **********/

// Assumes inclusions and exclusions are the same for all browsers
var deleteBuildFiles = function (includeGlobs, excludeGlobs) {
    var globs = [];
    for (let g of includeGlobs) {
        if (DEBUG) {
            globs.push(buildDirDebug + '/' + g);
            globs.push(buildDirDebugFirefox + '/' + g);
            globs.push(buildDirDebugChrome + '/' + g);
        } else {
            globs.push(buildDirProd + '/' + g);
            globs.push(buildDirProdFirefox + '/' + g);
            globs.push(buildDirProdChrome + '/' + g);
        }
    }
    if (excludeGlobs) for (let g of excludeGlobs) {
        if (DEBUG) {
            globs.push('!' + buildDirDebug + '/' + g);
            globs.push('!' + buildDirDebugFirefox + '/' + g);
            globs.push('!' + buildDirDebugChrome + '/' + g);
        } else {
            globs.push('!' + buildDirProd + '/' + g);
            globs.push('!' + buildDirProdFirefox + '/' + g);
            globs.push('!' + buildDirProdChrome + '/' + g);
        }
    }
    return del(globs);
};

gulp.task('clean:ts', function () {
    return deleteBuildFiles([], ['lib']);
});

gulp.task('clean:static:popup', function () {
    return deleteBuildFiles([globStaticPopup]);
});
gulp.task('clean:static:panels', function () {
    return deleteBuildFiles([globStaticPanels]);
});
gulp.task('clean:static:page', function () {
    return deleteBuildFiles([globStaticPage]);
});
gulp.task('clean:static:background', function () {
    return deleteBuildFiles([globStaticBackground]);
});
gulp.task('clean:static:settings', function () {
    return deleteBuildFiles([globStaticSettings]);
});
gulp.task('clean:static:dialogs', function () {
    return deleteBuildFiles([globStaticDialogs]);
});
gulp.task('clean:static:lib', function () {
    return deleteBuildFiles([globStaticLib]);
});
gulp.task('clean:static:common', function () {
    return deleteBuildFiles([globStaticCommon]);
});
gulp.task('clean:static:commonImages', function () {
    return deleteBuildFiles([globStaticCommonImages]);
});
gulp.task('clean:static:commonFonts', function () {
    return deleteBuildFiles([globStaticCommonFonts]);
});
gulp.task('clean:static:releasenotes', function () {
    return deleteBuildFiles([globStaticReleaseNotes]);
});
gulp.task('clean:static:locales', function () {
    return deleteBuildFiles([globStaticLocales]);
});
gulp.task('clean:static:manifest', function () {
    return deleteBuildFiles([globStaticManifest]);
});

gulp.task('clean', [
    'clean:static:manifest', 'clean:static:locales', 'clean:static:releasenotes',
    'clean:static:commonFonts', 'clean:static:commonImages',
    'clean:static:common', 'clean:static:dialogs', 'clean:static:settings',
    'clean:static:background', 'clean:static:page', 'clean:static:panels',
    'clean:static:popup', 'clean:ts:all'
]);

gulp.task('sign', function () {
    const manifest = require('./manifest');
    const distFileName = manifest.name + '-v' + manifest.version + '-debug.xpi';

    //TODO:4: If API output is suitable, derive these file names from that in case Mozilla change file naming conventions one day
    fs.writeFileSync('.signedKeeXPI', 'kee_password_manager-' + manifest.version + 'beta-an+fx.xpi');
    fs.writeFileSync('.downloadLinkKeeXPI', 'https://github.com/kee-org/browser-addon/releases/download/'
        + manifest.version + '/kee_password_manager-' + manifest.version + 'beta-an+fx.xpi');

    signAddon({
        xpiPath: 'dist/' + distFileName,
        version: manifest.version + 'beta',
        apiKey: process.env.AMO_API_KEY,
        apiSecret: process.env.AMO_API_SECRET,
        id: 'keefox@chris.tomlinson',
        downloadDir: 'dist/signed/',
        channel: 'unlisted'
      })
      .then(function(result) {
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
      .catch(function(error) {
        console.error("Signing error:", error);
      });
});
