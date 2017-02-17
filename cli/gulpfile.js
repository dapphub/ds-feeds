var exec = require('child_process').exec
var gulp = require('gulp')

// npm run build
gulp.task('dapple-build', function (cb) {
  exec('dapple build', {cwd: '../'}, function (err, res, failed) {
    if (err) {
      console.log(err)
    } else if (failed) {
      process.stdout.write(failed)
    } else {
      process.stdout.write('\u001b[32mDapple build completed!\n')
    }
    cb(err)
  })
})


gulp.task('build', ['dapple-build'], function (){
  return gulp.src([
      '../build/js_module.js'
  ])
  .pipe(gulp.dest('lib/'))
})
