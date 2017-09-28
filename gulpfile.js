'use strict'
// http://webdesign-master.ru/blog/tools/2016-03-09-gulp-beginners.html
// https://soundcloud.com/web-standards/tracks

// constants

var gulp = require('gulp'),
	del = require('del'),
	pug = require('gulp-pug'),
	less = require('gulp-less'),
	pug = require('gulp-pug'),
	notify = require("gulp-notify"), 						// Уведомления об ошибках
	lessImport = require('gulp-less-import'), 				// Ебаный импорт
	browserSync  = require('browser-sync'),
	imagemin     = require('gulp-imagemin'), 				// Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'), 			// Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'), 					// Подключаем библиотеку кеширования
	spritesmith = require('gulp.spritesmith'),
	autoprefixer = require('gulp-autoprefixer');			// Библиотека для автоматического добавления префиксов

// pug to html

gulp.task('pug', function(){
	return gulp.src('dev/**/*.pug')
		.pipe(pug({
			pretty: true 									// Не сжимает страницу на выходе!
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
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы

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
	gulp.watch('pub/img/*.png', browserSync.reload);
	gulp.watch('pub/js/*.js', browserSync.reload);
})

gulp.task('sprite', function() {
    var spriteData = 
        gulp.src('pub/img/icons/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.less',
                cssFormat: 'less',
                algorithm: 'binary-tree',
                cssVarMap: function(sprite) {
                    sprite.name = 'l-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest('pub/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('dev/styles/')); // путь, куда сохраняем стили
});

// optimize images

gulp.task('img', function() {
	return gulp.src('pub/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('pub/img')); // Выгружаем на продакшен
})

// default task (watch + browser sync)

gulp.task('default', ['watch'])