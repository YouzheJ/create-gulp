var gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var revCollector = require('gulp-rev-collector'); 
var rev = require('gulp-rev');
var rename = require("gulp-rename");
var clean = require('gulp-clean');
var minifyHtml = require('gulp-minify-html-2');
var RevAll = require('gulp-rev-all');
var less = require('gulp-less');
var plumber = require('gulp-plumber');  //处理管道崩溃问题
var notify = require('gulp-notify');  //报错与不中断当前任务
var util = require('gulp-util');
var proxy = require('http-proxy-middleware');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('default', function () {
  
});

/**
 * 启动调试服务器
 */
gulp.task('start', function () {
  browserSync.init({
    port: 3000,
    server: {
      baseDir: 'src'
    },
    // 接口代理
    middleware: [
      proxy(['/api'], {target: 'http://baidu.com', changeOrigin: true}),
    ]
  });

  // 注意路径要正确，否则不能自动刷新
  gulp.watch(['**/*.html', '**/css/*.css', '**/js/*.js'], {cwd: 'src'}, reload);
});

// 监听less
gulp.task('start_less', ['lessWatch', 'start']);

/**
 * less编译, 不知道为什么，只能生成在同一目录下
 */
gulp.task('less', function () {
  gulp.src(['src/*/css/*.less']) // reset.less 不编译
      .pipe(plumber({errorHandler: notify.onError('Error:<%= error.message %>;')}))  //如果less文件中有语法错误，用notify插件报错，用plumber保证任务不会停止
      .pipe(less().on('error', util.log))
      .pipe(gulp.dest('./src'));
});

gulp.task('lessWatch', function () {
  gulp.watch('src/*/css/*.less', ['less']); //当所有less文件发生改变时，调用buildLess任务
});

/**
 * 压缩打包
*/

var temp_path = './temp';
var build_path = './build';

gulp.task('build', ['less', 'minify_js', 'minify_css', 'images'], function () {
  gulp.start('rev_html');
  gulp.start('rev_all');
});

gulp.task('build_jsp', ['less', 'minify_js', 'minify_css', 'images'], function () {
  gulp.start('rev_html');
  gulp.start('rev_jsp');
  gulp.start('rev_all');
})

gulp.task('minify_js', ['clean'], function () {
  /**
   * 压缩js
   */
  return gulp.src('./src/*/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(temp_path))
});

gulp.task('minify_css', ['clean'], function () {
  /**
   * 压缩css
   */
  return gulp.src('./src/**/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(temp_path))
});

gulp.task('images', ['clean'], function () {
  /**
   * 图片搬迁
   */
  return gulp.src('./src/**/images/*')
    .pipe(gulp.dest(temp_path))
});

gulp.task('clean', function () {
  return gulp.src(['build', 'temp']).pipe(clean());
});

gulp.task('rev_all', ['rev_html'], function () {
  return gulp.src(temp_path + '/**')
    .pipe(RevAll.revision({
      dontRenameFile: ['.html', '.jsp', 'min.js', 'min.css']
    }))
    .pipe(gulp.dest(build_path));
});

/**
 * 替换版本号，压缩html（script压缩暂时没有处理）
 */
gulp.task('rev_html', function () {
  return gulp.src(['./src/**/*.html'])
    .pipe(minifyHtml({
      empty: true,  
      spare: true
    }))
    .pipe(gulp.dest(temp_path));
});

/**
 * 替换版本号，压缩html（script压缩暂时没有处理）jsp
 */
gulp.task('rev_jsp', function () {
    return gulp.src(['./src/**/*.jsp'])
    .pipe(minifyHtml({
      empty: true,  
      spare: true
    }))
    .pipe(gulp.dest(temp_path));
});
