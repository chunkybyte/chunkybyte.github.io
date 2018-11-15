var gulp = require('gulp');
var sass = require('gulp-sass');
const babel = require('gulp-babel');

gulp.task('scripts', () =>
    gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'))
);

gulp.task('sassify', () => 
    gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist'))
);

gulp.task('default', gulp.series('sassify','scripts', function(done) { 
    done();
}));
