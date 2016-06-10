var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');
var riot = require('gulp-riot');
var _ = require('lodash')
var realm = require('realm-js');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;
var node;

gulp.task('server', function() {
   if (node) node.kill()
   node = spawn('node', ['app.js'], {
      stdio: 'inherit'
   })
   node.on('close', function(code) {
      if (code === 8) {
         gulp.log('Error detected, waiting for changes...');
      }
   });
});

gulp.task('watch', function() {
   gulp.watch(['src/**/*.js'], ['build']);
   gulp.watch(['views/**/*.html'], ['build-views']);

   //gulp.watch(['views/**/*.html'], ['build-views']);
});

gulp.task("build-src", function(done) {
   return realm.transpiler2.universal("src/", "build/");
});;

gulp.task("build-test", function(done) {
   return realm.transpiler2.universal("test-app/", "build/app");
});;

gulp.task("ui-riot", function() {
   return gulp.src("src/ui/**/*.tag")
      .pipe(riot({
         compact: true
      }))
      .pipe(realm.transpiler2.gulp(__dirname + "/src/ui/", "realm-ui-tags.js", {
         preffix: "realm.tags"
      }))
      .on('error', function(e) {
         console.log(e.stack);
         this.emit('end');
      })
      .pipe(gulp.dest('./build'));
});

gulp.task("riot", function() {
   return gulp.src("test-app/app/tags/**/*.tag")
      .pipe(riot({
         compact: true
      }))
      .pipe(realm.transpiler2.gulp(__dirname + "/test-app/app/tags/", "riot-tags.js", {
         preffix: "app.tags"
      }))
      .on('error', function(e) {
         console.log(e.stack);
         this.emit('end');
      })
      .pipe(gulp.dest('./build'));
});

gulp.task('start', function() {
   return runSequence('build-src', 'build-test', 'ui-riot', 'riot', function() {
      runSequence('server')

      gulp.watch(['src/**/*.js'], function() {
         return realm.transpiler2.universal("src/", "build/").then(function(changes) {
            runSequence('server')
         });
      });

      gulp.watch(['test-app/**/*.js'], function() {
         return realm.transpiler2.universal("test-app/", "build/app").then(function(changes) {
            runSequence('server')
         });
      });

      gulp.watch(['src/ui/**/*.tag'], function() {
         runSequence('ui-riot');
      });

      gulp.watch(['test-app/app/tags/**/*.tag'], function() {
         runSequence('riot');
      });
   });
});
