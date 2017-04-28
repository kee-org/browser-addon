var gulp = require("gulp");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');

gulp.task("default", [ "build" ]);
gulp.task("build", ["ts:background", "ts:popup", "ts:page" ]);

gulp.task("lint:ts", ["lint:background", "lint:popup", "lint:page" ]);

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

gulp.task('watch', ['build'], function() {
    gulp.watch(['common/**/*.ts', 'popup/**/*.ts'], ['ts:popup']);
    gulp.watch(['common/**/*.ts', 'page/**/*.ts'], ['ts:page']);
    gulp.watch(['common/**/*.ts', 'background/**/*.ts'], ['ts:background']);
});

gulp.task('collect', function() {
    gulp.src('page/page.js')
		.pipe(gulp.dest('build/page'));
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
	gulp.src('common/*.js')
		.pipe(gulp.dest('build/common'));
	gulp.src('common/images/**')
		.pipe(gulp.dest('build/common/images'));
	gulp.src('background/*.js')
		.pipe(gulp.dest('build/background'));
	gulp.src('_locales/**')
		.pipe(gulp.dest('build/_locales'));
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
