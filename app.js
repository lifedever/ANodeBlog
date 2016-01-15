var express = require('express');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var flash = require('connect-flash');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');

var config = require('./config');
var routes = require('./routes/index');
var dbHelper = require('./db/dbHelper');
var hbsHelper = require('./lib/hbsHelper');
var users = require('./routes/users');
var articles = require('./routes/articles');

var app = express();
app.set('env', 'development');


var hbs = exphbs.create({
    partialsDir: 'views/partials',
    layoutsDir: "views/layouts/",
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: hbsHelper
});

mongoose.connect(config.db.url);
global.dbHelper = dbHelper;


// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: config.db.cookieSecret
}));
app.use(function (req, res, next) {
    res.locals.appTitle = config.site.title;
    res.locals.flash_success_message = req.flash(config.constant.flash.success);
    res.locals.flash_error_message = req.flash(config.constant.flash.error);
    next();
});


app.use('/', routes);

app.use('/users', users);
app.use('/p', articles);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
