var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var concat = require('gulp-concat');
var del = require('del');
var utilities = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});
var buildProduction = utilities.env.production;


gulp.task('concatInterface',function(){ //combine all *-interface.js files into one file
	return gulp.src(['./js/*-interface.js'])
	.pipe(concat("allConcat.js"))
	.pipe(gulp.dest('./tmp/js'))
});

gulp.task('jsBrowserify',['concatInterface'],function(){ //makes the combined files readable by browser
	return browserify({entries:'./tmp/js/allConcat.js'})
	.bundle()
	.pipe(source('app.js'))
	.pipe(gulp.dest('./build/js'))
});

gulp.task("bowerJS", function(){ //tracking changes to bower external JS files
	return gulp.src(lib.ext("js").files)
	.pipe(concat('vendor.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest("./build/js"))
});

gulp.task("bowerCSS", function(){ //tracking changes to bower external css files
	return gulp.src(lib.ext("css").files)
	.pipe(concat("vendor.css"))
	.pipe(gulp.dest("./build/css"))
})

gulp.task("bower",["bowerJS", "bowerCSS"]); //doing all the bower tracking at once



gulp.task('bowerBuild', ['bower'], function(){ //do bower and then reload browser
  browserSync.reload();
});

gulp.task('jsBuild',['jsBrowserify'],function(){ //do jsBuild and then reload browser
	browserSync.reload();
});



gulp.task('minifyScripts',['jsBrowserify'],function(){//minify my app.js file
	return gulp.src(['./build/js/app.js'])
	.pipe(uglify())
	.pipe(gulp.dest('./build/js'))
});

gulp.task('clean',function(){ //delete the build and tmp directories
	return del(['build','tmp'])
});


gulp.task('build',['clean'],function(){ //jsBrowsify or minifyScripts but first clean
	if (buildProduction){
		gulp.start('minifyScripts')
	}else{
		gulp.start('jsBrowserify')
	}
	gulp.start('bower');
});

gulp.task('jshint', function(){ //check that code follows all ECMA6 guidelines 
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('htmlBuild', function(){
	browserSync.reload();
});
gulp.task('cssBuild', function(){
	browserSync.reload();
});

gulp.task('serve', function(){
	browserSync.init({
		server:{
			baseDir:"./",
			index:"index.html"
		}
	})
	gulp.watch(['./js/*.js'], ['jsBuild']);
  gulp.watch(['./bower.json'], ['bowerBuild']);
  gulp.watch(['*.html'], ['htmlBuild']);
  gulp.watch(['./css/*.css'],['cssBuild']);

});
