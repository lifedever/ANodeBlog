var express = require('express');
var webHelper = require('../lib/webHelper');
var dbHelper = require('../db/dbHelper');
var config = require('../config');
var router = express.Router();
var passport = require('passport');
var utils = require('utility');
var async = require('async');

/* GET home page. */
router.get('/', function (req, res, next) {
    var Article = global.dbHelper.Article;
    Article.find().populate('_user').sort({'views': 'desc'}).exec(function (error, doc) {
        webHelper.reshook(error, next, function () {
            res.render('index', {
                articles: doc
            });
        });
    });

});

router.get('/login', function (req, res) {
    res.render('login', {
        layout: 'lg'
    });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: '用户名或密码错误!'
}), function (req, res, next) {
    req.flash(config.constant.flash.success, '欢迎回来，' + req.body.username);
    res.redirect('/');
});

router.get('/join', function (req, res) {
    res.render('register', {
        layout: 'lg'
    })
});
router.post('/join', function (req, res, next) {
    var user = req.body;
    if (!user.username || !user.password) {
        req.flash(config.constant.flash.error, '用户名或密码不能为空!');
        res.redirect('/join');
        return;
    }
    if (!user.email) {
        req.flash(config.constant.flash.error, '邮箱不能为空!');
        res.redirect('/join');
        return;
    }
    if (user.password != user.confirm_password) {
        req.flash(config.constant.flash.error, '两次密码输入不一致!');
        res.redirect('/join');
        return;
    }
    next();

}, function (req, res, next) {
    var user = req.body;
    var User = dbHelper.User;

    async.parallel({
        username: function (callback) {
            User.findOne({username: user.username}, function (err, doc) {
                callback(null, doc);
            });
        },
        email: function (callback) {
            User.findOne({email: user.email}, function (err, doc) {
                callback(null, doc);
            });
        }
    }, function (err, results) {
        if(results.username) {
            req.flash(config.constant.flash.error, '用户名已被占用');
            res.redirect('/join');
            return;
        }
        if(results.email){
            req.flash(config.constant.flash.error, '邮箱已被占用');
            res.redirect('/join');
            return;
        }

        user.password = utils.md5(user.password, 'base64');
        User.create(user, function (err, doc) {
            webHelper.reshook(err, next, function () {
                req.flash(config.constant.flash.success, '注册成功，请登录!');
                res.redirect('/login');
            });
        });
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
