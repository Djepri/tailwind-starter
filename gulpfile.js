const gulp = require("gulp");
const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const browserSync = require("browser-sync").create();
const cssnano = require("cssnano");
const purgecss = require("gulp-purgecss");
const reload = browserSync.reload;

// Custom extractor for purgeCSS, to avoid stripping classes with `:` prefixes
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || [];
  }
}

gulp.task('css', function () {
  return gulp.src('src/scss/*.scss')
    // Use gulp-sass to convert SCSS to CSS
    .pipe(sass())
    .pipe(postcss([
      require('tailwindcss'),
      require('autoprefixer'),
    ]))
    // write file to disk
    .pipe(gulp.dest('dist/css/'))
    // refresh browser
    .pipe(reload({
      stream: true
    }));
})


gulp.task('build', function () {
  return gulp.src('src/scss/*.scss')
    // Use gulp-sass to convert SCSS to CSS
    .pipe(sass())
    .pipe(postcss([
      require('tailwindcss'),
      require('autoprefixer'),
      // minimise
      cssnano()
    ]))
    // //remove unused css
    .pipe(purgecss({
      content: ['dist/*.html']
    }))
    // write file to disk
    .pipe(gulp.dest('dist/css/'))
    // refresh browser
    .pipe(reload({
      stream: true
    }));
})

gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });

  gulp.watch("dist/*.html").on("change", reload);
  gulp.watch("src/scss/*.scss", gulp.series('css'));
});

gulp.task('default', gulp.series('css', 'serve'));