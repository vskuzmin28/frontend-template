'use strict'
// http://webdesign-master.ru/blog/tools/2016-03-09-gulp-beginners.html
// https://soundcloud.com/web-standards/tracks

// constants

var gulp = require('gulp'),
	pug = require('gulp-pug'),
	less = require('gulp-less'),
	pug = require('gulp-pug'),
	notify = require("gulp-notify"), // Обработчик ошибок
	lessImport = require('gulp-less-import'), // Ебаный импорт
	browserSync  = require('browser-sync');

// pug to html

gulp.task('pug', function(){
	return gulp.src('dev/**/*.pug')
		.pipe(pug({
			pretty: true // Не сжимает страницу на выходе!
		}))
		.on('error', notify.onError(function(err) {
			return {
				title: 'Html',
				message: err.message
			}
		}))
		.pipe(gulp.dest('pub'))
		.pipe(browserSync.reload({stream: true}))
})

// less to css

gulp.task('less', function(){
	return gulp.src('dev/**/*.less')
		.pipe(lessImport('styles/style.less'))
		.pipe(less())

		.on('error', notify.onError(function(err) {
			return {
				title: 'Styles',
				message: err.message
			}
		}))

		.pipe(gulp.dest('pub'))
		.pipe(browserSync.reload({stream: true}))
})

// browser sync

gulp.task('browser-sync', function() {
	browserSync({ 
		server: true,
		server: { 
			// Директория  в которой лежат доступные страницы
			baseDir: 'pub',
			index: "pages/index.html" // Начальная странице при обращении к localhost
		},
		notify: false
	})
})

// watcher

gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('dev/**/*.pug', ['pug']);
	gulp.watch('dev/**/*.less', ['less']);
	gulp.watch('pub/**/*.css', browserSync.reload);
	gulp.watch('pub/pages/*.html', browserSync.reload);
	gulp.watch('dev/img/*.png', browserSync.reload);
	gulp.watch('dev/js/*.js', browserSync.reload);
})

// default task (watch + browser sync)

gulp.task('default', ['watch'])