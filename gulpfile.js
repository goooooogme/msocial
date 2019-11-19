const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const scss  = require('gulp-sass');
const sourcemaps  = require('gulp-sourcemaps');

const cssFiles = [
    './src/css/style.css' 
];

const jsFiles = [
    './src/js/main.js'
];

function compileScss() {
    return gulp.src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(scss().on('error', scss.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./src/css'))
}

function styles() {
    return gulp.src(cssFiles)
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./src/build/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/build/js'))
        .pipe(browserSync.stream())
}

function clean() {
    return del(['./src/build/*']);
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./src/scss/**/*.scss", gulp.series('scss-compile'));
}

gulp.task('styles', styles);
gulp.task('scripts',scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
gulp.task('dev', gulp.series('build', 'watch'));
gulp.task('scss-compile', compileScss);