var gulp = require("gulp");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var fs = require("fs");
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');
var merge = require('merge-stream');
var sequence = require('run-sequence');
var del = require('del');
var replace = require('gulp-replace');
var signAddon = require('sign-addon').default;

// Some tasks set DEBUG to false so that a production build can be executed.
// There doesn't appear to be a way to pass this as a local variable so we
// have to ensure every invocation of gulp only builds in either production
// or debug mode but not both (tasks run concurrently)
var DEBUG = true;

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
const globTSCommon = 'common/**/*.ts';
const globTSCommonOut = 'common.js';
const globTSPopup = 'popup/**/*.ts';
const globTSPopupOut = 'popup.js';
const globTSPanels = 'panels/**/*.ts';
const globTSPanelsOut = 'panels.js';
const globTSPage = 'page/**/*.ts';
const globTSPageOut = 'page.js';
const globTSVault = 'vault/**/*.ts';
const globTSVaultOut = 'vault.js';
const globTSBackground = 'background/**/*.ts';
const globTSBackgroundOut = 'app.js';
const globTSSettings = 'settings/**/*.ts';
const globTSSettingsOut = 'settings.js';
const globTSDialogs = 'dialogs/**/*.ts';
const globTSDialogsOut = 'dialogs/**/*.js';


/********** TOP-LEVEL ORCHESTRATION **********/

gulp.task('default', ['build:debug']);
gulp.task('build', ['build:debug']);

gulp.task('build:debug', function (done) {
    sequence(['compilets', 'static'], done);
});
gulp.task('build:prod', function (done) {
    DEBUG = false;
    sequence(['compilets', 'static'], done);
});

gulp.task("compilets", function (done) {
    sequence("compilets:common", ["compilets:background", "compilets:popup",
        "compilets:panels", "compilets:page", "compilets:vault", "compilets:settings",
        "compilets:dialogs"], done);
});

/********** LINTING TYPESCRIPT **********/

gulp.task("lint:ts", ["lint:background", "lint:popup", "lint:panels", "lint:page", "lint:vault", "lint:settings", "lint:dialogs" ]);

gulp.task("lint:background", function() {
    return gulp.src([globTSBackground])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:page", function() {
    return gulp.src([globTSPage])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:vault", function() {
    return gulp.src([globTSVault])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:popup", function() {
    return gulp.src([globTSPopup])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:panels", function() {
    return gulp.src([globTSPanels])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:settings", function() {
    return gulp.src([globTSSettings])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:dialogs", function() {
    return gulp.src([globTSDialogs])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:common", function() {
    return gulp.src([globTSCommon])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

/********** COMPILING SHARED TYPESCRIPT LIBRARY **********/

var tsProjectCommon = ts.createProject("common/tsconfig.json", {
    outFile: globTSCommonOut,
    declaration: true
});
gulp.task("compilets:common", ["clean:ts:common", "lint:common"], function() {

    if (DEBUG) {
        var tsResult = tsProjectCommon.src()
            .pipe(sourcemaps.init())
            .pipe(tsProjectCommon());
        return merge(
        tsResult.dts.pipe(gulp.dest('typedefs')),
        tsResult.js.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(buildDirDebug + '/common'))
        .pipe(gulp.dest(buildDirDebugChrome + '/common'))
        .pipe(gulp.dest(buildDirDebugFirefox + '/common'))
        );
    } else {
        var tsResult = tsProjectCommon.src()
                .pipe(tsProjectCommon());
            return merge(
            tsResult.dts.pipe(gulp.dest('typedefs')),
            tsResult.js
            .pipe(gulp.dest(buildDirProd + '/common'))
            .pipe(gulp.dest(buildDirProdChrome + '/common'))
            .pipe(gulp.dest(buildDirProdFirefox + '/common'))
            );
    }
});

/********** COMPILING TYPESCRIPT **********/

var buildTypescript = function (tsProject, destination) {
    if (DEBUG) {
        return tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(buildDirDebug + '/' + destination))
            .pipe(gulp.dest(buildDirDebugChrome + '/' + destination))
            .pipe(gulp.dest(buildDirDebugFirefox + '/' + destination));
    } else {
        return tsProject.src()
            .pipe(tsProject())
            .js
            .pipe(gulp.dest(buildDirProd + '/' + destination))
            .pipe(gulp.dest(buildDirProdChrome + '/' + destination))
            .pipe(gulp.dest(buildDirProdFirefox + '/' + destination));
    }
};

var tsProjectBackground = ts.createProject("background/tsconfig.json", {
    outFile: globTSBackgroundOut
});
gulp.task("compilets:background", ["clean:ts:background", "lint:background"], function() {
    return buildTypescript(tsProjectBackground, "background");
});

var tsProjectPopup = ts.createProject("popup/tsconfig.json", {
    outFile: globTSPopupOut
});
gulp.task("compilets:popup", ["clean:ts:popup", "lint:popup"], function() {
    return buildTypescript(tsProjectPopup, "popup");
});

var tsProjectPanels = ts.createProject("panels/tsconfig.json", {
    outFile: globTSPanelsOut
});
gulp.task("compilets:panels", ["clean:ts:panels", "lint:panels"], function() {
    return buildTypescript(tsProjectPanels, "panels");
});

var tsProjectPage = ts.createProject("page/tsconfig.json", {
    outFile: globTSPageOut
});
gulp.task("compilets:page", ["clean:ts:page", "lint:page"], function() {
    return buildTypescript(tsProjectPage, "page");
});

var tsProjectVault = ts.createProject("vault/tsconfig.json", {
    outFile: globTSVaultOut
});
gulp.task("compilets:vault", ["clean:ts:vault", "lint:vault"], function() {
    return buildTypescript(tsProjectVault, "vault");
});

var tsProjectSettings = ts.createProject("settings/tsconfig.json", {
    outFile: globTSSettingsOut
});
gulp.task("compilets:settings", ["clean:ts:settings", "lint:settings"], function() {
    return buildTypescript(tsProjectSettings, "settings");
});

var tsProjectDialogs = ts.createProject("dialogs/tsconfig.json", {});
gulp.task("compilets:dialogs", ["clean:ts:dialogs", "lint:dialogs"], function() {
    return buildTypescript(tsProjectDialogs, "dialogs");
});

/********** STATIC FILE COPYING / MANIPULATION **********/

var copyStatic = function (glob, dir) {
    return gulp.src(glob)
    .pipe(gulp.dest((DEBUG ? buildDirDebug : buildDirProd) + dir))
    .pipe(gulp.dest((DEBUG ? buildDirDebugFirefox : buildDirProdFirefox) + dir))
    .pipe(gulp.dest((DEBUG ? buildDirDebugChrome : buildDirProdChrome) + dir))
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
            .pipe(replace(/(.*"version": ")(.*)(",.*)/g, '$1$2beta$3'))
            .pipe(replace(/(.*"version_name": ")(.*)(",.*)/g, ''))
            .pipe(gulp.dest(buildDirDebugFirefox)),
            gulp.src([buildDirDebugChrome + '/manifest.json'])
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
            .pipe(replace(/(.*"version_name": ")(.*)(",.*)/g, ''))
            .pipe(replace(/(.*"update_url": ")(.*)(",.*)/g, ''))
            .pipe(gulp.dest(buildDirProdFirefox)),
            gulp.src([buildDirProdChrome + '/manifest.json'])
            .pipe(replace(/(,[\s]*?)"applications": ([\S\s]*?}){2}/g, ''))
            // hack to workaround https://github.com/mozilla/webextension-polyfill/issues/70 :
            .pipe(replace(/(.*"clipboardWrite",)(.*)/g, ''))
            .pipe(replace(/(.*"clipboardRead",)(.*)/g, ''))
            .pipe(gulp.dest(buildDirProdChrome))
        )
    }
});

gulp.task('static:manifest', ["clean:static:manifest"], function(done) {

    sequence("copyStaticManifest", "modifyBuildFilesForCrossBrowser", done);
});

gulp.task('static', ['static:popup','static:panels','static:page','static:background',
    'static:settings','static:dialogs','static:common','static:commonFonts',
    'static:commonImages','static:releasenotes','static:locales',
    'static:manifest', 'static:lib']);

/********** WATCHING FOR CHANGES TO SOURCE FILES **********/

gulp.task('watch', ['compilets', 'static'], function() {
    gulp.watch([globTSCommon], ['compilets:common']);
    gulp.watch([globTSPopup], ['compilets:popup']);
    gulp.watch([globTSPanels], ['compilets:panels']);
    gulp.watch([globTSPage], ['compilets:page']);
    gulp.watch([globTSVault], ['compilets:vault']);
    gulp.watch([globTSBackground], ['compilets:background']);
    gulp.watch([globTSSettings], ['compilets:settings']);
    gulp.watch([globTSDialogs], ['compilets:dialogs']);
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
    sequence(['compilets', 'static'], ['xpi','zip'], done);
});

gulp.task('package:debug', function (done) {
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

gulp.task('clean:ts:dialogs', function () {
    return deleteBuildFiles([globTSDialogsOut, globTSDialogsOut + '.map'], ['dialogs']);
});
gulp.task('clean:ts:settings', function () {
    return deleteBuildFiles([globTSSettingsOut, globTSSettingsOut + '.map']);
});
gulp.task('clean:ts:background', function () {
    return deleteBuildFiles([globTSBackgroundOut, globTSBackgroundOut + '.map']);
});
gulp.task('clean:ts:page', function () {
    return deleteBuildFiles([globTSPageOut, globTSPageOut + '.map']);
});
gulp.task('clean:ts:vault', function () {
    return deleteBuildFiles([globTSVaultOut, globTSVaultOut + '.map']);
});
gulp.task('clean:ts:panels', function () {
    return deleteBuildFiles([globTSPanelsOut, globTSPanelsOut + '.map']);
});
gulp.task('clean:ts:popup', function () {
    return deleteBuildFiles([globTSPopupOut, globTSPopupOut + '.map']);
});
gulp.task('clean:ts:common', function () {
    return deleteBuildFiles([globTSCommonOut, globTSCommonOut + '.map']);
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
    'clean:static:popup', 'clean:ts:common', 'clean:ts:popup', 'clean:ts:panels',
    'clean:ts:page', 'clean:ts:vault', 'clean:ts:background', 'clean:ts:settings',
    'clean:ts:dialogs'
]);

gulp.task('sign', function () {
    const manifest = require('./manifest');
    const distFileName = manifest.name + '-v' + manifest.version + '-debug.xpi';

    //TODO:4: If API output is suitable, derive these file names from that in case Mozilla change file naming conventions one day
    fs.writeFileSync('.signedKeeXPI', 'kee-' + manifest.version + 'beta-an+fx.xpi');
    fs.writeFileSync('.downloadLinkKeeXPI', 'https://github.com/kee-org/browser-addon/releases/download/'
        + manifest.version + '/kee-' + manifest.version + 'beta-an+fx.xpi');

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
