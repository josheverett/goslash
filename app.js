var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var moment = require('moment');

// Has side effects.
require('intl');

var routes = require('./routes/index');

var app = express(),
    env = app.get('env');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/images/goslash.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// Middleware to make the current path the title of the page, so that the
// favicon+page title is literally the URL you are on. whoadude.gif @_@
app.use(function (req, res, next) {
  res.locals.title = req.params.slug || req.path.split('/')[1] || 'goslash';
  next();
});

app.use('/', routes);

// Routes that we don't want to allow as shortlinks for whatever reason.
app.locals.protectedRoutes = ['go', 'goslash'];

// Random globally stuff we wanna expose to views.
app.locals.packageJson = require('./package.json');
app.locals.moment = moment;

// Catch 404 and forward to error handler.
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Generic error handler.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: 'oh noes!',
    statusCode: res.statusCode,
    alert: {
      type: 'danger',
      message: err.message
    },
    error: err,
    env: env
  });
});

module.exports = app;
