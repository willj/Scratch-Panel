var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

gulp.task("default", function(){
	return gulp.src("src/*.js")
	.pipe(uglify())
	.pipe(rename({extname: ".min.js"}))
	.pipe(gulp.dest("sample"))
	.pipe(gulp.dest("dist"));
});

gulp.task("watch", function(){
	gulp.watch("src/*.js", ["default"]);
});
