var express = require('express');
var webHelper = require('../lib/webHelper');
var dbHelper = require('../db/dbHelper');
var config = require('../config');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
    var Article = global.dbHelper.Article;
    Article.find(function (error, doc) {
        webHelper.reshook(error, next, function () {
            res.render('index', {
                articles: doc
            });
        });
    });

});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: '用户名或密码错误!'
}), function (req, res, next) {
    req.flash(config.constant.flash.success, '欢迎回来，' + req.body.username);
    res.redirect('/');
});

router.get('/join', function (req, res) {
    res.render('register')
});
router.post('/join', function (req, res, next) {
    var user = req.body;
    var User = dbHelper.User;
    User.findOne({username: user.username}, function (err, doc) {
        webHelper.reshook(err, next, function () {
            if (doc) {
                req.flash(config.constant.flash.error, '用户名已被占用!');
                res.redirect('/join');
            } else {
                User.create(user, function (err, doc) {
                    webHelper.reshook(err, next, function () {
                        req.flash(config.constant.flash.success, '注册成功，请登录!');
                        res.redirect('/login');
                    });
                });
            }
        });
    });
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
