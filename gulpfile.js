var gulp = require('gulp');

//var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-rimraf');
var copy = require('gulp-copy');
var flatten = require('gulp-flatten');
var minifycss = require('gulp-minify-css');
var convertEncoding = require('fd-gulp-convert-encoding');
var pump = require('pump');
var debug = require('gulp-debug');
var uglifyjs = require('uglify-js');
var minifier = require('gulp-uglify/minifier');

var jade = require('gulp-jade');
var swig = require('gulp-swig');

var path = require('./build/build.js').getFiles();

/**
 * jade 模板
 */
gulp.task('gulp-jade', ['copy-css-jade', 'copy-js-jade', 'copy-mode-jade'], function() {
    return gulp.src('./newdoc/jade/examples/*.jade')
        .pipe(jade({
            pretty: false
        }))
        .pipe(gulp.dest('./dist/newdoc'));
});

/**
 * swig 模板
 */
gulp.task('gulp-swig', ['copy-css-jade', 'copy-js-jade', 'copy-mode-jade', 'copy-fonts-jade', 'copy-images-jade'], function() {
    return gulp.src('./newdemos/swig/examples/*')
        .pipe(swig())
        .pipe(gulp.dest('./dist/newdemos'));
});

/**
 * COPY mode Of Templates
 */
gulp.task('copy-mode-jade', function() {
    return gulp.src(['./newdemos/mode/**/*'])
        .pipe(gulp.dest('./dist/newdemos/mode'));
});

/**
 * COPY JS Of Templates
 */
gulp.task('copy-js-jade', function() {
    return gulp.src(['./newdemos/js/**/*'])
        .pipe(gulp.dest('./dist/newdemos/js'));
});

gulp.task('copy-mapdemo', ['clean-mapdemo'], function() {
    return gulp.src(['./mapDemopage/**/*'])
        .pipe(gulp.dest('./dist/mapDemopage/'));
});

gulp.task('clean-mapdemo', function() {
    clean('./dist/mapDemopage/**/*');
});

/**
 * COPY CSS Of Templates
 */
gulp.task('copy-css-jade', function() {
    return gulp.src(['./newdemos/css/**/*'])
        .pipe(gulp.dest('./dist/newdemos/css'));
});

/**
 * COPY fonts Of Templates
 */
gulp.task('copy-fonts-jade', function() {
    return gulp.src(['./newdemos/fonts/**/*'])
        .pipe(gulp.dest('./dist/newdemos/fonts'));
});

/**
 * COPY images Of Templates
 */
gulp.task('copy-images-jade', function() {
    return gulp.src(['./newdemos/image/**/*'])
        .pipe(gulp.dest('./dist/newdemos/image'));
});

/**
 * COPY DOC
 */
gulp.task('copy-image', function() {
    return gulp.src(['./images/*'])
        .pipe(copy('./dist/'));
});

/**
 * COPY EzMapAPI.JS to DIST
 */
gulp.task('copy-ezmapapi', function() {
    return gulp.src(['./EzMapAPI.js'])
        .pipe(copy('./dist/lib/'));
});

/**
 * COPY EzMapAPI.JS to DEBUG
 */
gulp.task('copy-ezmapapi-debug', function() {
    return gulp.src(['./EzMapAPI.js'])
        .pipe(copy('./debug/'));
});

/**
 * 复制第三方插件到目标文件
 */
gulp.task('copy-thirds', function() {
    return gulp.src(['./thirds/*'])
        .pipe(copy('./dist/'));
});

/**
 * COPY package.json to DIST
 */
gulp.task('copy-package', function() {
    return gulp.src(['./publish.package.json'])
        .pipe(rename('package.json'))
        .pipe(gulp.dest('./dist/'));

});

/**
 * COPY serve.js to DIST
 */
gulp.task('copy-serve', function() {
    return gulp.src(['./DIST.serve.js'])
        .pipe(rename('serve.js'))
        .pipe(gulp.dest('./dist/'));
});

/**
 * COPY INDEX.HTML
 */
gulp.task('copy-doc', function() {
    return gulp.src(['./doc/**/*'])
        .pipe(gulp.dest('./dist/'));
});

/**
 * COPY Plugins
 */
gulp.task('copy-plugins', function() {
    return gulp.src(['./thirds_plugins/**/*'])
        .pipe(gulp.dest('./dist/thirds_plugins/'));
});

/**
 * COPY TASKS
 */
gulp.task('copys', ['copy-image', 'copy-thirds', 'copy-ezmapapi', 'copy-package', 'copy-serve', 'copy-doc', 'copy-mapdemo', 'copy-plugins']);

/**
 * build JS
 */
gulp.task('build', ['clean', 'copys', 'css'], function(cb) {
    var options = {
        compress: false
    };
    pump([
        gulp.src(path),
        convertEncoding('utf-8'),
        concat('EzServerClient.min.js'),
        debug({ title: 'uglify:' }),
        minifier(options, uglifyjs),
        //uglify(),
        gulp.dest('dist/lib/')
    ], cb);
    // return gulp.src(path)
    //     .pipe(convertEncoding('utf-8'))
    //     .pipe(concat('EzServerClient.min.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest('dist/lib/'));
});

gulp.task('build-debug', ['clean-debug', 'copy-ezmapapi-debug', 'css-debug'], function() {
    return gulp.src(path)
        .pipe(convertEncoding('utf-8'))
        .pipe(concat('EzServerClient.js'))
        .pipe(gulp.dest('debug/'));
});

gulp.task('clean', function() {
    clean('./dist');
});

gulp.task('clean-debug', function() {
    clean('./debug');
});

gulp.task('css', function() {
    return gulp.src(['./lib/ol.css', './css/*.css'])
        .pipe(convertEncoding('utf-8'))
        .pipe(concat('EzServerClient.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/lib/'));
});

gulp.task('css-debug', function() {
    return gulp.src(['./lib/ol.css', './css/*.css'])
        .pipe(convertEncoding('utf-8'))
        .pipe(concat('EzServerClient.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./debug'));
});
