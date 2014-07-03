'use strict';

// npm install --save-dev gulp gulp-load-plugins gulp-util gulp-autoprefixer gulp-cache gulp-imagemin gulp-bower-files gulp-filter gulp-ignore gulp-flatten gulp-csso gulp-useref gulp-if gulp-uglify gulp-rimraf gulp-size gulp-jshint jshint-stylish gulp-livereload gulp-nodemon wiredep bower-requirejs requirejs gulp-debug gulp-changed gulp-concat gulp-ember-templates gulp-insert gulp-plumber

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var paths = {
    src: {
        common: 'app/client'
    },
    dev_dist: 'public/assets'
};

/*** BUILD ***/

gulp.task('clean', function() {
    return gulp.src(['.tmp', 'public/assets'], { read: false})
        .pipe($.rimraf());
});

gulp.task('styles', function() {
    return gulp.src(paths.src.common + '/styles/**/*.css')
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('images', function() {
    return gulp.src(paths.src.common + '/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(paths.dev_dist + '/images'));
});

gulp.task('fonts', function() {
    var streamqueue = require('streamqueue');
    return streamqueue({objectMode: true},
                       $.bowerFiles(),
                       gulp.src(paths.src.common + '/fonts/**/*')
                      )
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest(paths.dev_dist + '/fonts'));
});

gulp.task('extras', function() {
    return gulp.src(paths.src.common + '/*')
        .pipe(gulp.dest(paths.dev_dist));
});

gulp.task('build-dev-templates', ['styles'], function() {
    var amdModulePrefix = 'define(["ember"], function(Ember) {',
        amdModulePostfix = '});';
    
    return gulp.src([paths.src.common + '/templates/**/*.hbs'])
        .pipe($.plumber())
        .pipe($.emberTemplates({
            type: 'browser'
        }))
        .pipe($.concat('common.js'))
        .pipe($.insert.wrap(amdModulePrefix, amdModulePostfix))
        .pipe(gulp.dest(paths.dev_dist + '/templates'));
});

gulp.task('build-dev-templates2', function() {
    return gulp.src([paths.src.common + '/templates/**/*.hbs'])
        .pipe($.emberTemplates({
            type: 'amd'
        }))
        .pipe($.concat('common.js'))
        .pipe(gulp.dest(paths.dev_dist + '/templates'));
});


gulp.task('build-dev-commonjs', function() {
    return gulp.src([paths.src.common + '/bower_components/**/*.js'])
        .pipe($.changed(paths.dev_dist + '/scripts/lib'))
        .pipe(gulp.dest(paths.dev_dist + '/scripts/lib'));
});

gulp.task('build-dev-mainjs', ['jshint'], function() {
    return gulp.src([paths.src.common + '/scripts/*.js'])
        .pipe($.changed(paths.dev_dist + '/scripts'))
        .pipe(gulp.dest(paths.dev_dist + '/scripts'));
});

//----
// Build Tasks
//----
gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function() {
    return gulp.src(paths.dev_dist + '/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('build-dev-scripts', function(cb) {
    runSequence('clean',
                ['jshint', 'build-dev-templates', 'build-dev-commonjs', 'build-dev-mainjs'],
               cb);
});

//---
// Dev Tasks
//---

gulp.task('server', ['build', 'watch']);
gulp.task('devserver', ['build-dev-scripts', 'watch-devserver']);



/*** SERVE / WATCH / RELOAD ***/

gulp.task('jshint', function() {
    return gulp.src(['gulpfile.js',
                    'config/*.js',
                    'app/**/*.js',
                    '!app/client/bower_components/**'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

// inject bower components into requirejs config
gulp.task('bower-rjs', function() {
    var bowerRjs = require('bower-requirejs');

    bowerRjs({
        config: paths.src.common + '/scripts/common.js'
    });
});

gulp.task('serve', ['build-dev-scripts'], function() {
    $.nodemon({ script: 'config/server.js',
                watch: [
                    'config/**/*.js',
                    'lib'
                ]})
        .on('restart', function() {
            setTimeout(function() {
                $.livereload.changed();
            }, 1000);
        });
});

gulp.task('watch-devserver', ['serve'], function() {
    $.livereload.listen();

    gulp.watch(paths.src.common + '/styles/**/*.css', ['styles', 'build-dev-mainjs']);

    gulp.watch([
        paths.src.common + '/templates/*.hbs'
    ], ['build-dev-templates']);

    gulp.watch(paths.src.common + '/scripts/**/*.js', ['build-dev-mainjs']);

    gulp.watch('app/views/**/*.hbs', function(files) {
        $.livereload.changed(files);
    });
    
    gulp.watch(paths.dev_dist + '/**/*',function(files) {
        $.livereload.changed(files);
    });
    
    gulp.watch('bower.json', ['bower-rjs']);
    gulp.watch('gulpfile.js', function() {
        console.log($.util.colors.red('\n----------' +
                                    '\nRestart the Gulp process' +
                                    '\n----------'));
    });
});
