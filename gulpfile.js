'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var include = require('gulp-file-include');


var browserSync = require('browser-sync').init({
	server: {
		baseDir: './release/'
	}
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

gulp.task('js', function(){
	return gulp.src('./release/js/*.js')
		.pipe(browserSync.stream());
});

gulp.task('browser-sync', function(){
	return browserSync.reload();
});

gulp.task('watch', function(){
	gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('./release/*.html', gulp.series('html'));
	gulp.watch('./src/html/**/*.html', gulp.series('include'));
	gulp.watch('./release/js/*.js', gulp.series('js'));
});