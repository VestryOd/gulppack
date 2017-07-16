var gulp       		= require('gulp'), // Подключаем Gulp
    sass         	= require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  	= require('browser-sync'), // Подключаем Browser Sync
    concat       	= require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       	= require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      	= require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       	= require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          	= require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     	= require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     	= require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        	= require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer 	= require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
    smartgrid 		= require('smart-grid'), //умная четка на флексах, аналог bootstrap
	gcmq 			= require('gulp-group-css-media-queries'), //группировка медиа запросов
	cleanCSS		= require('gulp-clean-css'); //минифицирует и сжимает CSS

var settings = {//настройки для smartgrid
    outputStyle: 'sass', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: "30px", /* gutter width px || % */
    container: {
        maxWidth: '1280px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        xl: {
            'width': '1200px', /* -> @media (max-width: 1100px) */
            'fields': '30px' /* side fields */
        },
        lg: {
            'width': '992px',
            'fields': '15px'
        },
        md: {
            'width': '768px',
            'fields': '15px'
        },
        sm: {
            'width': '480px',
            'fields': '15px'
        },
        xs: {
            'width': '320px',
            'fields': '10px'
        }
    }
};

gulp.task('smartgrid', function() {
	smartgrid('./app/sass/', settings)
});

gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.sass') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        //.pipe(gcmq()) - if use smartgrid to group media queries
        .pipe(autoprefixer(['last 15 versions', '> 0.01%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        //Альтернатива CSSNano
     //    .pipe(cleanCSS({
	    // 	compatibility: 'ie8',
	    // 	beautify: true,
	    // 	keepBreaks: true,
	    // 	keepSpecialComments: 0,
	    // 	recursivelyOptimizeProperties: true
	    // }))
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('gcmq', function () {
    gulp.src('app/css/style.css')
        .pipe(gcmq())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('minify-css', function() {
  return gulp.src('app/css/style.css')
    .pipe(cleanCSS({
    	compatibility: 'ie8',
    	beautify: true,
    	keepBreaks: true,
    	recursivelyOptimizeProperties: true
    }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('bootstrap', function() {
	return gulp.src('app/libs/bootstrap.scss')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(gulp.dest('app/css'))
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css/'));
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);