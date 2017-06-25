{
	'use strict'

	let gulp 					= require('gulp'),
			browserSync 	= require('browser-sync').create();
			autoprefixer 	= require('gulp-autoprefixer'),
			concat 				= require('gulp-concat'),
			imageMin 			= require('gulp-imagemin'),
			notify 				= require('gulp-notify'),
			plumber 			= require('gulp-plumber'),
			sass 					= require('gulp-sass'),
			sourcemaps 		= require('gulp-sourcemaps'),
			uglify 				= require('gulp-uglify'),
			cssnano				= require('gulp-cssnano'),
			clean 				= require('gulp-clean')

	// Clean Build Folder
	gulp.task('clean', () => {
		return gulp.src('./build', {read: false})
			.pipe(clean())
	})

	// BrowserSync Server
	gulp.task('bs', () => {
		browserSync.init({
			notify: false,
			server: {
		    baseDir: './build'
			}
		})
	})

	// Move HTML
	gulp.task('moveHTML', () => {
		return gulp.src('./source/index.html')
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.reload({stream:true}))
	})

	// Move Templates
	gulp.task('moveTemplates', () => {
		return gulp.src('./source/templates/*.template')
		.pipe(gulp.dest('./build/templates'))
		.pipe(browserSync.reload({stream:true}))
	})

	// STYLES
	gulp.task('styles', () => {
		return gulp.src('./source/styles/main.scss')
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autoprefixer('last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
			// .pipe(cssnano())
			.pipe(concat('./main.min.css'))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./build'))
			.pipe(browserSync.reload({ stream: true }))
	})

	// main.js SCRIPTS
	gulp.task('mainScripts', () => {
		return gulp.src('./source/scripts/main.js')
			.pipe(plumber({
				errorHandler: notify.onError("Error: <%= error.message %>")
			}))
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(concat('./app.min.js'))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./build'))
			.pipe(browserSync.reload({stream:true}))
	})

	// Move Sammy Scripts
	gulp.task('moveSammy', () => {
		return gulp.src('./source/scripts/sammy/*.js')
			.pipe(gulp.dest('./build/sammy/'))
	})

	// Moving Data to Build
	gulp.task('data', () => {
		return gulp.src('./source/data/**/*.json')
			.pipe(gulp.dest('./build/data/'))
	})

	// Image processing
	gulp.task('images', () => {
		return gulp.src('./source/assets/images/*')
			.pipe(imageMin())
			.pipe(gulp.dest('./build/images/'))
	})

	// Watching Files for changes and reloading
	gulp.task('watch', () => {
		gulp.watch('./source/styles/**/*.scss', ['styles'])
		gulp.watch('./source/scripts/**/*.js', ['mainScripts'])
		gulp.watch('./source/index.html', ['moveHTML'])
		gulp.watch('./source/templates/*.template', ['moveHTML'], browserSync.reload)
	})

	// Setting a default task to run all processes
	gulp.task('default', ['moveHTML', 'moveTemplates', 'styles', 'moveSammy','mainScripts', 'images', 'bs', 'data', 'watch'])

}
