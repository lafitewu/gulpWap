'use strict';

var path = require('path');
var gulp = require('gulp');
var mainBowerFiles = require('gulp-main-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpFilter = require('gulp-filter');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

module.exports = function(gulp, plugins, args, config, taskTarget, browserSync) {
    var dirs = config.directories;
    var dest = path.join(taskTarget);

    // Copy
    gulp.task('main-bower-files', function() {
        var filterJS = gulpFilter('**/*.js', {
            restore: true
        });

        var filterCss = gulpFilter('**/*.css', {
            restore: true
        });

        var stream = gulp.src('./bower.json')
            .pipe(plugins.changed(dest))
            .pipe(mainBowerFiles())
            .pipe(filterJS)
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest(path.join(dest, dirs.scripts.replace(/^_/, ''),'vendor')))
            .pipe(uglify())
            .pipe(rename('vendor.min.js'))
            .pipe(gulp.dest(path.join(dest, dirs.scripts.replace(/^_/, ''),'vendor')))
            .pipe(filterJS.restore)
            .pipe(plugins.changed(dest))
            .pipe(filterCss)
            .pipe(concat('vendor.css'))
            .pipe(gulp.dest(path.join(dest, dirs.styles.replace(/^_/, ''),'vendor')))
            .pipe(minifyCss())
            .pipe(rename('vendor.min.css'))
            .pipe(gulp.dest(path.join(dest, dirs.styles.replace(/^_/, ''),'vendor')));
        return stream;
    });
};
