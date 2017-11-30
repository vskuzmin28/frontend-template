'use strict'

// variables

var gulp 			= require('gulp'),
	del 			= require('del'),					// Отчистка билда
	
	pug 			= require('gulp-pug'),				
	less 			= require('gulp-less'),
	autoprefixer 	= require('gulp-autoprefixer'),		// Автопрефиксы

	notify 			= require('gulp-notify'),			// Уведомления об ошибках
	concat 			= require('gulp-concat'),
	rename			= require('gulp-rename'),
	
	imagemin 		= require('gulp-imagemin'),
	cache 			= require('gulp-cache'),
	pngquant 		= require('imagemin-pngquant'),
	
	browserSync 	= require('browser-sync');

// pug to html

gulp.task('pug', function(){
	return gulp.src('dev/**/*.pug')
		.pipe(pug({
			pretty: true 								// Не сжимает страницу на выходе
		}))

		.on('error', notify.onError(function(err) {
			return {
				title: 'html',
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
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 				// Создаем префиксы

		.on('error', notify.onError(function(err) {
			return {
				title: 'styles',
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
			baseDir: 'dev', 							// Директория  в которой лежат доступные страницы
			index: '/pages/index.html'					// Начальная странице при обращении к localhost
		},
		notify: false
	})
})

// optimize css

gulp.task('css-minify', function() {
    return gulp.src(['pub/styles/**/*.css'])
        .pipe(concat('style.min.css')) 					// Собираем их в кучу в новом файле
        .pipe(gulp.dest('pub/styles')) 					// Выгружаем в папку pub/styles
})

// watcher

gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('dev/**/*.pug', ['pug']);
	gulp.watch('dev/**/*.less', ['less']);
	gulp.watch('dev/**/*.html', browserSync.reload);
	gulp.watch('dev/js/**/*.js', browserSync.reload);
})

// clean directory pub

gulp.task('pub-del', function () {
    del(['pub']);
})

// optimize images

gulp.task('img', function() {
	return gulp.src('dev/img/**/*') 			// Берем все изображения из dev
		.pipe(cache(imagemin({ 					// Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dev/img')); 			// Выгружаем в dev
})

// random values 1, 100 for generate sprite

const getRandomIntInRange = (min, max) =>
	Math.floor(Math.random() * (max - min + 1) ) + min

// create sprite from icons

gulp.task('sprite', ['sprite-clean'], function() {
	var fileName = 'sprite-' + getRandomIntInRange(1, 100) + '.png';

    var spriteData = 
        gulp.src('dev/img/icons/*.*') 											// путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: fileName,
                cssName: 'sprite.less',
                padding: 2,
                cssFormat: 'less',
                algorithm: 'binary-tree', 										// алгоритм, по которому выстраивает изображения
                cssVarMap: function(sprite) {
                    sprite.name = 'l-' + sprite.name
                },
                imgPath: '../img/' + fileName,
            }));

    spriteData.img.pipe(gulp.dest('dev/img/')); 								// путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('dev/styles/helpers')); 						// путь, куда сохраняем стили
})

// dev mode (watch + browserSync)

gulp.task('dev', ['watch', 'pug', 'less'])

// build mode

gulp.task('build', ['pub-clean', 'pug', 'less'], function() {

    var buildFonts = gulp.src('dev/fonts/*.*')
    .pipe(gulp.dest('pub/fonts'))

    var buildImg = gulp.src('dev/img/**/*.*')
    .pipe(gulp.dest('pub/img'))

    var buildCss = gulp.src('dev/styles/*.css')
    .pipe(gulp.dest('pub/styles'))

    var buildHtml = gulp.src('dev/pages/*.html')
    .pipe(gulp.dest('pub'))

    var buildJs = gulp.src('dev/js/*.js')
    .pipe(gulp.dest('pub/js'))

})

