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
	
	spritesmith		= require('gulp.spritesmith'),
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

		.pipe(gulp.dest('build'))
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

		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({stream: true}))
})

// browserSync

gulp.task('browser-sync', function() {
	browserSync({ 
		server: true,
		server: { 
			baseDir: 'build', 							// Директория  в которой лежат доступные страницы
			index: '/pages/index.html'					// Начальная странице при обращении к localhost
		},
		notify: false,
		open: false
	})
})

// optimize css

gulp.task('css-min', function() {
    return gulp.src(['build/styles/**/*.css'])
        .pipe(concat('style.min.css')) 					// Собираем их в кучу в новом файле
        .pipe(gulp.dest('build/styles')) 					// Выгружаем в папку build/styles
})

// watcher

gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('dev/**/*.pug', ['pug']);
	gulp.watch('dev/**/*.less', ['less']);
	gulp.watch('dev/**/*.html', browserSync.reload);
	gulp.watch('dev/js/**/*.js', browserSync.reload);
})

// clean directory build

gulp.task('build-del', function () {
    del(['build']);
})

// optimize images

gulp.task('img', function() {
	return gulp.src('dev/img/**/*') 			// Берем все изображения из build
		.pipe(cache(imagemin({ 					// Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dev/img')); 			// Выгружаем в build
})

// Удаление старых файлов

gulp.task('sprite-clean', function () {

    del(['dev/img/sprite.png']);
    del(['dev/styles/helpers/sprite.less']);

})

// create sprite from icons

gulp.task('sprite', ['sprite-clean'], function() {

    var spriteData = 
        gulp.src('dev/img/icons/*.*') 							// путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.less',
                padding: 8,
                cssFormat: 'less_retina',

                imgPath: '../img/sprite.png',

                algorithm: 'top-down',							// алгоритм, по которому выстраивает изображения

        		//cssTemplate: 'dev/styles/helpers/retina-sprite.less.template.mustache',

                cssVarMap: function(sprite) {
                    sprite.name = 'l-' + sprite.name
                },

        		retinaSrcFilter: ['dev/img/icons/*@2x.png'],
        		retinaImgName: '../img/sprite-2x.png',                
                retinaimgPath: '../img/sprite-2x.png'

            }));

    spriteData.img.pipe(gulp.dest('dev/img/')); 				// путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('dev/styles/helpers')); 		// путь, куда сохраняем стили
})

// copy

gulp.task('copy', function() {

    var copyCSS = gulp.src('dev/styles/**/*.css')
    .pipe(gulp.dest('build/styles'))

    var copyFonts = gulp.src('dev/fonts/*.*')
    .pipe(gulp.dest('build/fonts'))

    var copyImg = gulp.src('dev/img/**/*.*')
    .pipe(gulp.dest('build/img'))

    var copyJs = gulp.src('dev/js/**/*.js')
    .pipe(gulp.dest('build/js'))

})

// dev mode (watch + browserSync)

gulp.task('dev', ['watch', 'pug', 'less', 'copy'])

// build mode

gulp.task('build', ['build-del', 'pug', 'less'], function() {

    var buildFonts = gulp.src('dev/fonts/*.*')
    .pipe(gulp.dest('build/fonts'))

    var buildImg = gulp.src('dev/img/**/*.*')
    .pipe(gulp.dest('build/img'))

    var buildCss = gulp.src('dev/styles/**/*.css')
    .pipe(gulp.dest('build/styles'))

    var buildHtml = gulp.src('dev/pages/*.html')
    .pipe(gulp.dest('build'))

    var buildJs = gulp.src('dev/js/*.js')
    .pipe(gulp.dest('build/js'))

})

