'use strict';

var path = require('path');
var autoprefixer = require('autoprefixer');
var gulpif = require('gulp-if');

module.exports = function(gulp, plugins, args, config, taskTarget, browserSync) {
  var dirs = config.directories;
  var entries = config.entries;
  var dest = path.join(taskTarget, dirs.styles.replace(/^_/, ''));

  // Sass compilation
  gulp.task('sass', function() {
    gulp.src(path.join(dirs.source, dirs.styles, entries.css))
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.compass({
        "css": dest,
        "sass": path.join(dirs.source, dirs.styles),
        "sourcemap": true
      }))
      .on('error', function(error) {
        // Would like to catch the error here
        console.log(error);
        this.emit('end');
      })
      // .on('error', plugins.sass.logError))
      .pipe(plugins.postcss([autoprefixer({browsers: ['last 2 version', '> 5%', 'safari 5', 'ios 6', 'android 4','Firefox >= 20','last 3 Safari versions'],remove:false})]))
      .pipe(plugins.rename(function(filepath) {
        // Remove 'source' directory as well as prefixed folder underscores
        // Ex: 'src/_styles' --> '/styles'
        filepath.dirname = filepath.dirname.replace(dirs.source, '').replace('_', '');
      }))
      .pipe(gulpif(args.production, plugins.minifyCss({rebase: false})))
      .pipe(plugins.sourcemaps.write('./'))
      .pipe(gulp.dest(dest))
      .pipe(browserSync.stream({match: '**/*.css'}));
  });
};
