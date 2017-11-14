'use strict'

// variables

var gulp 			= require('gulp'),
	pug 			= require('gulp-pug'),
	less 			= require('gulp-less'),
	pug 			= require('gulp-pug'),
	notify 			= require("gulp-notify"), 			// Уведомления об ошибках
	browserSync 	= require('browser-sync'),

// pug to html

gulp.task('pug', function(){
	return gulp.src('dev/**/*.pug')
		.pipe(pug({
			pretty: true 								// Не сжимает страницу на выходе!
		}))
		.on('error', notify.onError(function(err) {
			return {
				title: 'Html',
				message: err.message
			}
		}))
		.pipe(gulp.dest('dev'))
		.pipe(browserSync.reload({stream: true}))
})

// less to css

gulp.task('less', function(){
	return gulp.src('dev/**/*.less')
		.pipe(less())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы

		.on('error', notify.onError(function(err) {
			return {
				title: 'Styles',
				message: err.message
			}
		}))

		.pipe(gulp.dest('dev'))
		.pipe(browserSync.reload({stream: true}))
})

// browserSync

gulp.task('browser-sync', function() {
	browserSync({ 
		server: true,
		server: { 
			baseDir: 'dev', 			// Директория  в которой лежат доступные страницы
			index: "/pages/index.html" 	// Начальная странице при обращении к localhost
		},
		notify: false
	})
})

// watcher

gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('dev/**/*.pug', ['pug']);
	gulp.watch('dev/**/*.less', ['less']);
	gulp.watch('dev/**/*.css', browserSync.reload);
	gulp.watch('dev/**/*.html', browserSync.reload);
})


// develomnet (watch + browserSync)

gulp.task('dev', ['watch'])

