var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var image = require('gulp-image');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        proxy: "http://localhost:3000"
    });

    gulp.watch("public/stylesheets/*.scss", ['sass', browserSync.reload]);
    gulp.watch("views/*.hbs").on('change', browserSync.reload);
    gulp.watch("public/stylesheets/*.css", browserSync.reload);
    gulp.watch("public/routes/*.js", browserSync.reload);
    gulp.watch("public/stylesheets/*.css", ["autoprefixer", browserSync.reload]);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    var postcss      = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');
    var sourcemaps   = require('gulp-sourcemaps');

    return gulp.src("public/stylesheets/*.scss")
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("public/stylesheets"))
        .pipe(browserSync.stream())

});


gulp.task('default', ['serve']);


gulp.task('default-2', function() {
    gulp.src('public/images/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 1}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
            ]
        ))
        .pipe(gulp.dest('public/assets/images'))
});


gulp.task('image', function () {
    gulp.src('public/images/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: false,
            jpegRecompress: true,
            mozjpeg: false,
            guetzli: false,
            gifsicle: false,
            svgo: true,
            concurrent: 10
        }))
        .pipe(gulp.dest('./public'));
});


gulp.task('image-compress', ['default-2', 'image']);

gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src('./public/stylesheets/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
});