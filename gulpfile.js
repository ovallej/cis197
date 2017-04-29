var gulp = require('gulp');
var eslint = require('gulp-eslint');
//var zip = require('gulp-zip');

var FILES = [
  'server/*.js',
  'src/*.js',
  'src/components/*/*.js',
  'src/components/*.js'
];

var options = {
  rulePaths: ['.eslint_rules']
};

gulp.task('eslint', function () {
  return gulp.src(FILES)
    .pipe(eslint(options))
    .pipe(eslint.format());
});

gulp.task('defualt', function () {
  return gulp.src(FILES)
    .pipe(eslint({}))
    .pipe(eslint.format());
});


/*
gulp.task('zip', function () {
  return gulp.src(FILES, { base: '.' })
    .pipe(zip('files.zip'))
    .pipe(gulp.dest(''));
});
*/