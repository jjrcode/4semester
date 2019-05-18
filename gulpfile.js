// Requires Gulp v4.
// $ npm uninstall --global gulp gulp-cli
// $ rm /usr/local/share/man/man1/gulp.1
// $ npm install --global gulp-cli
// $ npm install
const { src, dest, watch, series, parallel } = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const sasslint = require('gulp-sass-lint');
const cache = require('gulp-cached');

// Compile CSS from Sass.
function buildStyles() {
  return src('static/src/scss/**.scss') // The source file with all the @import components in it.
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
    .pipe(sourcemaps.write())
    .pipe(dest('static/src/css/'))
    .pipe(browsersync.reload({ stream: true }))
}

// Watch changes on all *.scss files and trigger buildStyles() at the end.
function watchFiles() {
  watch(
    ['static/src/scss/*.scss', 'static/src/scss/**/*.scss'],
    series(buildStyles)
  );
}

// Init BrowserSync.
function browserSync() {
  browsersync.init({
    server: {
      baseDir: 'static/src'
    }
  });
};

// Init Sass linter.
function sassLint() {
  return src(['scss/*.scss', 'scss/**/*.scss'])
    .pipe(cache('sasslint'))
    .pipe(sasslint({
      configFile: '.sass-lint.yml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
}

// Export commands.
exports.default = parallel(browserSync, sassLint, watchFiles); // $ gulp
exports.sass = buildStyles; // $ gulp sass
exports.watch = watchFiles; // $ gulp watch
exports.build = series(buildStyles); // $ gulp build