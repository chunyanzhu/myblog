var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessionObj = require('./libs/sessionObj');
var writeErrorLog = require('./libs/writeErrorLog');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(checkLog);

app.use(/\/(index)?/, require('./routes/index'));
app.use('/users', users);
app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));
app.use('/getPass', require('./routes/getPass'));
app.use('/edit(/:id)?', require('./routes/edit'));
app.use('/person', require('./routes/person'));
app.use('/personEdit', require('./routes/personEdit'));
app.use('/post/:id', require('./routes/post'));//发布的文章
app.use('/draft/:id', require('./routes/draft'));//草稿箱的文章
//某个用户发布的文章列表
app.use('/user/:username', require('./routes/user'));
//某个分类文章列表
app.use('/cata/:id', require('./routes/cata'));



//接口
app.use('/doSignup', require('./routes/doSignup'));
app.use('/doSignin', require('./routes/doSignin'));
app.use('/doSignout', require('./routes/doSignout'));
app.use('/doUploadPhoto', require('./routes/doUploadPhoto'));
app.use('/doPersonEdit', require('./routes/doPersonEdit'));
app.use('/doSaveArticle', require('./routes/doSaveArticle'));
app.use('/doFav', require('./routes/doFav'));
app.use('/doComment', require('./routes/doComment'));
app.use('/doSendEmail', require('./routes/doSendEmail'));
app.use('/doGetPass', require('./routes/doGetPass'));
app.use('/doSetPwd', require('./routes/doSetPwd'));
app.use('/getCata', require('./routes/getCata'));
//上传的文件
//app.use('/uploads/*', require('./routes/getUploadFile'));

//captchapng
app.use('/captcha.png', require('./routes/captcha'));

//中间件
function checkLog(req, res, next){
  var redirectURL = req.originalUrl;
  var pathname = req._parsedUrl.pathname;
  var sid = req.cookies.sid;
  if(/^\/($)|(index)|(getCata)|(post)|(user)|(cata)|(doComment)|(doFav)/.test(pathname)){
    //不需要判断登陆条件
    next();
  }else if(/^\/(signin)|(doSignin)|(doSignup)|(doGetPass)|(signup)|(getpass)|(captcha)|(doSendEmail)|(doSetPwd)/.test(redirectURL)){
    //不需要登陆
    //var sid = req.cookies.sid;
    if(Object.keys(sessionObj).length && sessionObj[sid] && sessionObj[sid]['isSigned']){
      res.redirect('/index');
    }else{
      next();
    }
  }else{
    //需要登陆
    if(Object.keys(sessionObj).length && sessionObj[sid] && sessionObj[sid]['isSigned']){
      next();
    }else{
      res.redirect('/signin?redirectURL=' + encodeURIComponent(redirectURL));
    }
  }
}



// var router = express.Router();
// router.post('/doSignup', function(req, res, next){
//   console.log(req.body);
// });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
