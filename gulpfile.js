var gulp = require("gulp");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');

gulp.task("default", [ "build" ]);
gulp.task("build", ["ts:background", "ts:popup", "ts:page", "ts:settings" ]);

gulp.task("lint:ts", ["lint:background", "lint:popup", "lint:page", "lint:settings" ]);

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

gulp.task("lint:settings", function() {
    return gulp.src(["settings/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

var tsProjectBackground = ts.createProject("background/tsconfig.json", {
    outFile: "app.js"
});
gulp.task("ts:background", ["lint:background"], function() {
    return tsProjectBackground.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectBackground())
        .js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("background"));
});

var tsProjectPopup = ts.createProject("popup/tsconfig.json", {
    outFile: "popup.js"
});
gulp.task("ts:popup", ["lint:popup"], function() {
    return tsProjectPopup.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectPopup())
        .js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("popup"));
});

var tsProjectPage = ts.createProject("page/tsconfig.json", {
    outFile: "page.js"
});
gulp.task("ts:page", ["lint:page"], function() {
    return tsProjectPage.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectPage())
        .js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("page"));
});

var tsProjectSettings = ts.createProject("settings/tsconfig.json", {
    outFile: "settings.js"
});
gulp.task("ts:settings", ["lint:settings"], function() {
    return tsProjectSettings.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectSettings())
        .js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("settings"));
});

gulp.task('watch', ['build'], function() {
    gulp.watch(['common/**/*.ts', 'popup/**/*.ts'], ['ts:popup']);
    gulp.watch(['common/**/*.ts', 'page/**/*.ts'], ['ts:page']);
    gulp.watch(['common/**/*.ts', 'background/**/*.ts'], ['ts:background']);
});

gulp.task('collect', function() {
    gulp.src('page/page.js')
		.pipe(gulp.dest('build/page'));
    gulp.src('popup/popup.js')
		.pipe(gulp.dest('build/popup'));
    gulp.src('popup/popup.css')
		.pipe(gulp.dest('build/popup'));
    gulp.src('popup/popup.html')
		.pipe(gulp.dest('build/popup'));
    gulp.src('settings/settings.html')
		.pipe(gulp.dest('build/settings'));
    gulp.src('settings/*.css')
		.pipe(gulp.dest('build/settings'));
    gulp.src('settings/*.js')
		.pipe(gulp.dest('build/settings'));
	gulp.src('common/*.js')
		.pipe(gulp.dest('build/common'));
	gulp.src('common/images/**')
		.pipe(gulp.dest('build/common/images'));
	gulp.src('background/*.js')
		.pipe(gulp.dest('build/background'));
	gulp.src('_locales/**')
		.pipe(gulp.dest('build/_locales'));
	gulp.src('_locales/en-US/**')
		.pipe(gulp.dest('build/_locales/en_US')); //TODO:c: remove this hack when Firefox fixes locale location bug
	return gulp.src('manifest.json')
        .pipe(gulp.dest('build'));
});

gulp.task('zip', ['collect'], function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '.zip';
	return gulp.src('build/**')
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('xpi', ['collect'], function() {
	var manifest = require('./manifest'),
		distFileName = manifest.name + '-v' + manifest.version + '.xpi';
	return gulp.src('build/**')
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

gulp.task('package', ['xpi','zip']);
