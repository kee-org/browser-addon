var gulp = require("gulp");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');
var merge = require('merge-stream');

gulp.task("default", [ "build" ]);
gulp.task("build", ["ts:background", "ts:popup", "ts:panels", "ts:page", "ts:settings", "ts:dialogs" ]);
gulp.task("lint:ts", ["lint:background", "lint:popup", "lint:panels", "lint:page", "lint:settings", "lint:dialogs" ]);

gulp.task("lint:background", function() {
    return gulp.src(["background/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:page", function() {
    return gulp.src(["page/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:popup", function() {
    return gulp.src(["popup/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:panels", function() {
    return gulp.src(["panels/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:settings", function() {
    return gulp.src(["settings/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:dialogs", function() {
    return gulp.src(["dialogs/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task("lint:common", function() {
    return gulp.src(["common/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

var tsProjectCommon = ts.createProject("common/tsconfig.json", {
    outFile: "common.js",
    declaration: true
});
gulp.task("ts:common", ["lint:common"], function() {

var tsResult = tsProjectCommon.src()
    .pipe(sourcemaps.init())
    .pipe(tsProjectCommon());
    return merge(
      tsResult.dts.pipe(gulp.dest('typedefs')),
      tsResult.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('common'))
    );
});

var tsProjectBackground = ts.createProject("background/tsconfig.json", {
    outFile: "app.js"
});
gulp.task("ts:background", ["lint:background", "ts:common"], function() {
    return tsProjectBackground.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectBackground())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("background"));
});

var tsProjectPopup = ts.createProject("popup/tsconfig.json", {
    outFile: "popup.js"
});
gulp.task("ts:popup", ["lint:popup", "ts:common"], function() {
    return tsProjectPopup.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectPopup())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("popup"));
});

var tsProjectPanels = ts.createProject("panels/tsconfig.json", {
    outFile: "panels.js"
});
gulp.task("ts:panels", ["lint:panels", "ts:common"], function() {
    return tsProjectPanels.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectPanels())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("panels"));
});

var tsProjectPage = ts.createProject("page/tsconfig.json", {
    outFile: "page.js"
});
gulp.task("ts:page", ["lint:page", "ts:common"], function() {
    return tsProjectPage.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectPage())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("page"));
});

var tsProjectSettings = ts.createProject("settings/tsconfig.json", {
    outFile: "settings.js"
});
gulp.task("ts:settings", ["lint:settings", "ts:common"], function() {
    return tsProjectSettings.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectSettings())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("settings"));
});

var tsProjectDialogs = ts.createProject("dialogs/tsconfig.json", {
    //outFile: "dialogs.js"
});
gulp.task("ts:dialogs", ["lint:dialogs", "ts:common"], function() {
    return tsProjectDialogs.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectDialogs())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("dialogs"));
});

gulp.task('watch', ['build'], function() {
    gulp.watch(['common/**/*.ts', 'popup/**/*.ts'], ['ts:popup']);
    gulp.watch(['common/**/*.ts', 'panels/**/*.ts'], ['ts:panels']);
    gulp.watch(['common/**/*.ts', 'page/**/*.ts'], ['ts:page']);
    gulp.watch(['common/**/*.ts', 'background/**/*.ts'], ['ts:background']);
    gulp.watch(['common/**/*.ts', 'settings/**/*.ts'], ['ts:settings']);
    gulp.watch(['common/**/*.ts', 'dialogs/**/*.ts'], ['ts:dialogs']);
});

gulp.task('collect', function() {
    return merge(
        gulp.src('page/*.{js,css,html,map}')
            .pipe(gulp.dest('build/page')),
        gulp.src('popup/popup.{js,css,html,map}')
            .pipe(gulp.dest('build/popup')),
        gulp.src('panels/panels.{js,css,html,map}')
            .pipe(gulp.dest('build/panels')),
        gulp.src('settings/*.{js,css,html,map}')
            .pipe(gulp.dest('build/settings')),
        gulp.src('common/*.{js,css,html,map}')
            .pipe(gulp.dest('build/common')),
        gulp.src('common/images/**')
            .pipe(gulp.dest('build/common/images')),
        gulp.src('common/fonts/**')
            .pipe(gulp.dest('build/common/fonts')),
        gulp.src('dialogs/*.{js,css,html,map}')
            .pipe(gulp.dest('build/dialogs')),
        gulp.src('background/*.{js,css,html,map}')
            .pipe(gulp.dest('build/background')),
        gulp.src('_locales/**')
            .pipe(gulp.dest('build/_locales')),
        gulp.src('manifest.json')
            .pipe(gulp.dest('build'))
    );
});

gulp.task('zip', ['collect'], function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '.zip';
	return gulp.src(['build/**','!**/*.map'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('xpi', ['collect'], function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '.xpi';
	return gulp.src(['build/**','!**/*.map'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('package', ['xpi','zip']);

gulp.task('zip:beta', ['collect'], function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '-beta.zip';
	return gulp.src(['build/**'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('xpi:beta', ['collect'], function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '-beta.xpi';
	return gulp.src(['build/**'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('package:beta', ['xpi:beta','zip:beta']);
