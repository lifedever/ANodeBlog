var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');

var config = require('./config');
var authority = require('./lib/authority');
var dbHelper = require('./db/dbHelper');
var hbsHelper = require('./lib/hbsHelper');
var wxHelper = require('./lib/wxHelper');
var wx = require('wechat');
var wxRobot = require('./lib/wxRobot');
var duoshuoHelper = require('./lib/duoshuoHelper');
var jwt = require('jwt-simple');


if (config.wx.load) {  // 是否加载微信配置信息
    wxHelper.loadWX();
}

// routers

passport.use(new LocalStrategy(
    function (username, password, done) {
        dbHelper.User.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!user.validPassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});

var app = express();
app.set('env', 'development');


var hbs = exphbs.create({
    partialsDir: 'views/partials',
    layoutsDir: "views/layouts/",
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: hbsHelper
});

try {
    mongoose.connect(config.db.url);
} catch (error) {
    console.log(error);
}

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
    secret: config.db.cookieSecret,
    cookie: {maxAge: 30 * 60 * 1000}
}));
// config passport
app.use(passport.initialize());
app.use(passport.session());


/**
 * sso登录
 */
app.use(function (req, res, next) {
    var duoshuo_token = req.cookies.duoshuo_token;
    if (duoshuo_token && !req.session.duoshuoUser) {
        var obj = jwt.decode(duoshuo_token, 'a96576a72e54d62a1f36a69dc9234b8c');
        duoshuoHelper.login(obj, function(err, results){
            if(err) {
                next(err);
            }else{
                if(!results.localInfo) {
                    dbHelper.Reader.create({
                        username: results.duosuoInfo.response.name,
                        duoshuo_id: results.duosuoInfo.response.user_id,
                        url: results.duosuoInfo.response.url,
                        avatar_url: results.duosuoInfo.response.avatar_url
                    }, function(err, user){
                        if(err){
                            next(err);
                        }else{
                            req.session.duoshuoUser = user;
                        }
                    })
                }else{
                    req.session.duoshuoUser = results.localInfo;
                }
                next();
            }
        });
    }else{
        next();
    }
});
/**
 * 全局参数传递
 */
app.use(function (req, res, next) {
    res.locals.site = config.site;
    res.locals.success = req.flash(config.constant.flash.success);
    res.locals.error = req.flash(config.constant.flash.error);
    res.locals.session = req.session;
    next();
});

// home
app.use('/', require('./routes/index'));
app.use('/p', require('./routes/articles'));
app.use('/u', require('./routes/users'));

// dashboard role['user']
app.use('/dashboard', authority.isAuthenticated, require('./routes/dashboard/dashboard'));
app.use('/dashboard/p', authority.isAuthenticated, require('./routes/dashboard/dashboard-p'));
app.use('/dashboard/u', authority.isAuthenticated, require('./routes/dashboard/dashboard-u'));

app.use('/reader', authority.isReaderLogin, require('./routes/reader/reader'));
app.use('/reader/p', authority.isReaderLogin, require('./routes/reader/reader-p'));

// admin role['admin']
app.use('/admin', authority.isAdmin, require('./routes/admin/admin'));
app.use('/admin/user', authority.isAdmin, require('./routes/admin/admin-user'));
app.use('/admin/inviteCode', authority.isAdmin, require('./routes/admin/admin-inviteCode'));
app.use('/admin/wx', authority.isAdmin, require('./routes/admin/admin-wx'));
app.use('/admin/robot', authority.isAdmin, require('./routes/admin/admin-robot'));

// wx
app.use('/api/wx', wx(global.wx, function (req, res, next) {
    var wx = req.weixin;
    wxRobot.reply(wx, res);
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('404');
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
