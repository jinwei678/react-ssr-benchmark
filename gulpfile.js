// -*- coding: utf-8; -*-
var gulp = require('gulp');
var source = require("vinyl-source-stream"); // instead gulp-browserify
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var reactify = require('reactify');
var babelify = require("babelify");

gulp.task("browserify",function(){
    return browserify({entries: 'src/index.jsx', extensions: ['.jsx'], debug: true})
                                         .transform('babelify', {
                                             "presets": ['es2015', 'react', 'stage-0'],
                                             "plugins": [ "transform-class-properties", "transform-decorators-legacy" ]
                                         })
                                          .bundle()
                                         .pipe(source('index.js'))
                                         // .pipe(sourcemaps.write('.'))
                                         .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
    gulp.watch(['src/*.jsx'], ['browserify']);
});
