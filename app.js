var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// connect to db
mongoose.connect('mongodb://localhost:27017/qcms');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// session config
app.use(session({
  secret: 'quasKEY 555',
  cookie: {
    maxAge: 1800000 // half an hour
  }
}));

// routing
function setRoute(file) {
  var routeFile = require('./routes/' + file + '.route');
  routeFile(app);
}

// backend api
setRoute('post');

// front end
// admin
setRoute('admin'); // includes admin and login
// public
setRoute('main'); // includes home, about, ...
setRoute('view'); // views
setRoute('index');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found: ' + req.path);
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
