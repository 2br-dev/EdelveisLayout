'use strict';
 
var gulp = require('gulp');
var order = require('gulp-order');
var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
// var strip = require('gulp-strip-comments');
var nodeSass = require('sass');
var gulpSass = require('gulp-sass');
var sass = gulpSass(nodeSass);
var include = require('gulp-file-include');
const { task } = require('gulp');


var browserSync = require('browser-sync').init({
	server: {
		baseDir: './release/'
	}
});

gulp.task('js', function(){
	return gulp.src('./src/js/*.js')
		.pipe(order([
			"!jquery.min.js",
			"jquery.lazy.js",
			"materialize.js",
			"swiper-bundle.js",
			"master.js",
			"brand.js"
		]))
		.pipe(concat('master.js'))
		.pipe(gulp.dest('./release/js/'))
		.pipe(browserSync.stream());
});

gulp.task('sass', function() {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./release/css'))
		.pipe(browserSync.stream());
});

gulp.task('include', function(){
	return gulp.src('./src/html/*.html')
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./release/'));
})

gulp.task('html', function(){
	return gulp.src(['./release/*.html', './src/html/**/*.html'])
		.pipe(browserSync.stream());
});

gulp.task('browser-sync', function(){
	return browserSync.reload();
});

gulp.task('watch', function(){
	gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('./release/*.html', gulp.series('html'));
	gulp.watch('./src/html/**/*.html', gulp.series('include'));
	gulp.watch('./src/js/*.js', gulp.series('js'));
});