const gulp = require('gulp');
const ts = require('gulp-typescript');
const print = require('gulp-print');
const nodemon = require('nodemon');

// pull in the project Typescript config
const tsProject = ts.createProject('tsconfig.json');
//task to be run when the watcher detects changes
gulp.task('tsBuild', () => {
  console.log("Typescript rebuild");
  return gulp.src('src/server/**/*.ts')
    .pipe(tsProject())
    .pipe(print())
    .pipe(gulp.dest('dist/server'));
});

// set up a watcher to watch over changes
// and trigger a rebuild to dist
// not required for DEV
gulp.task('watch', ['tsBuild'], () => {
  gulp.watch(['src/server/**/*.ts'], ['tsBuild']);
});

gulp.task('default', ['serve']);

gulp.task('serve', function(){
  nodemon({
    ext: 'ts js',
    env: { 'NODE_ENV': 'development' },
    exec: ' ts-node --project src/server src/server/server.ts '
  })
  .on('restart', function(){
    console.log('restarted');
  })
}) 