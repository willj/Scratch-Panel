var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var markdown = require("gulp-markdown");

gulp.task("script", function(){
	return gulp.src("src/*.js")
	.pipe(uglify())
	.pipe(rename({extname: ".min.js"}))
	.pipe(gulp.dest("sample"))
	.pipe(gulp.dest("dist"));
});

gulp.task("md", function(){
	return gulp.src("README.md")
	.pipe(markdown())
	.pipe(rename("index.html"))
	.pipe(gulp.dest("./"));
});

gulp.task("default", ["script", "md"]);

gulp.task("watch", function(){
	gulp.watch("src/*.js", ["default"]);
	gulp.watch("README.md", ["md"]);
});
