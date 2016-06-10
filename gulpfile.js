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
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var bump = require('gulp-bump');

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

gulp.task('increment-version', function() {
   gulp.src('./package.json')
      .pipe(bump())
      .pipe(gulp.dest('./'));
});
gulp.task('push', function(done) {
   var publish = spawn('npm', ['publish'], {
      stdio: 'inherit'
   })
   publish.on('close', function(code) {
      if (code === 8) {
         gulp.log('Error detected, waiting for changes...');
      }
      done()
   });
})
gulp.task("publish", ['dist', 'increment-version'], function() {
   runSequence('push')
})

gulp.task('dist', ['do-frontend'], function() {

});
gulp.task('dist-frontend', ['build-src', 'ui-riot'], function() {
   return gulp.src([
         "build/frontend.js",
         "build/realm-ui-tags.js"
      ])
      .pipe(concat('realm.riot.js'))
      .pipe(babel({
         presets: ["es2016"]
      }))
      .pipe(gulp.dest("./build"))
      .pipe(gulp.dest("./dist/frontend/"))
});

gulp.task('do-frontend', ['dist-frontend'], function() {
   return gulp.src([
         "dist/frontend/realm.riot.js"
      ])
      .pipe(rename('realm.riot.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest("./dist/frontend/"))
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
