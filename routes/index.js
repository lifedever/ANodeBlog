var express = require('express');
var webHelper = require('../lib/webHelper');
var dbHelper = require('../db/dbHelper');

var config = require('../config');
var router = express.Router();
var passport = require('passport');
var utils = require('utility');
var async = require('async');
var cheerio = require('cheerio');
var superagent = require('superagent');
var lodash = require('lodash');
var jwt = require('jwt-simple');

var search = function (req, res, next, menu) {

    var searchParams, orderParams;

    var type = req.query.type || '';
    var recommend = req.query.recommend;
    var page = req.query.page || 1;
    var Article = dbHelper.Article;
    var q = req.query.q || '';

    if (menu == undefined || menu == 'new') {
        searchParams = {
            title: new RegExp(q, 'i'),
            type: new RegExp(type, 'i')
        };
        orderParams = {
            up: -1,
            created_time: 'desc'
        };
    } else if (menu == 'hot') {
        searchParams = {
            title: new RegExp(q, 'i'),
            type: new RegExp(type, 'i')
        };
        orderParams = {
            up: -1,
            views: 'desc'
        };
    } else if (menu == 'fire') {
        searchParams = {
            title: new RegExp(q, 'i'),
            type: new RegExp(type, 'i'),
            views: {$gt: 99}
        };
        orderParams = {
            up: -1,
            views: 'desc'
        };
    }
    if (recommend) {
        searchParams.recommend = recommend;
    }
    async.parallel({
        page: function (callback) {
            dbHelper.Methods.pageQuery(page, config.article.pageSize, Article, '_user', searchParams, orderParams, function (error, $page) {
                callback(error, $page);
            });
        },
        reader: function (callback) {
            var userId = req.session.duoshuoUser ? req.session.duoshuoUser._id : null;
            dbHelper.Reader.findById(userId, function (err, reader) {
                callback(err, reader);
            });
        }
    }, function (err, results) {
        webHelper.reshook(err, next, function () {
            res.render('index', {
                articles: results.page.results,
                pageCount: results.page.pageCount,
                pageNumber: page,
                count: results.page.count,
                q: q,
                type: type,
                recommend: recommend,
                menu: menu,
                reader: results.reader
            });
        });
    });

};

router.get('/', function (req, res, next) {
    search(req, res, next);
});

/* GET home page. */
router.get('/hot', function (req, res, next) {
    search(req, res, next, 'hot');

});

/**
 * 最新发表
 */
router.get('/new', function (req, res, next) {
    search(req, res, next, 'new');
});

/**
 * 被点亮的文章
 */
router.get('/fire', function (req, res, next) {
    search(req, res, next, 'fire');
});


/**
 * 登录
 */
router.get('/login', function (req, res) {
    res.render('login', {
        layout: 'lg'
    });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: '用户名或密码错误!'
}), function (req, res, next) {
    var username = req.body.username;
    dbHelper.User.findOne({username: username}).exec(function (err, user) {
        if (err) {
            next(err);
        } else if (!user.status) {
            req.flash(config.constant.flash.error, '账户已被禁用，请联系gefangshuai@outlook.com！');
            res.redirect('/login');
        } else {
            req.session.user = user;
            req.flash(config.constant.flash.success, '欢迎回来，' + username);
            res.redirect('/dashboard');
        }
    });
});

/**
 * 注册
 */
router.get('/join', function (req, res) {
    res.render('register', {
        layout: 'lg'
    })
});
router.post('/join', function (req, res, next) {

    /* req.flash(config.constant.flash.error, '注册功能已被停用，请联系管理员: gefangshuai@outlook.com');
     res.redirect('/login');
     return;*/
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
    var InviteCode = dbHelper.InviteCode;

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
        },
        inviteCode: function (callback) {
            InviteCode.update({code: user.inviteCode, used: false}, {used: true}, function (err, raw) {
                callback(null, raw);
            })
        }
    }, function (err, results) {
        if (results.username) {
            req.flash(config.constant.flash.error, '用户名已被占用');
            res.redirect('/join');
            return;
        }
        if (results.email) {
            req.flash(config.constant.flash.error, '邮箱已被占用');
            res.redirect('/join');
            return;
        }

        if (results.inviteCode.ok == 0) {
            req.flash(config.constant.flash.error, '注册码无效');
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

/**
 * 退出
 */
router.get('/logout', function (req, res) {
    req.logout();
    res.clearCookie('duoshuo_token');
    req.session.destroy();
    res.redirect('/');
});

/**
 * 多说单点登录
 */
router.get('/sso-login', function (req, res, next) {
    var code = req.query.code;
    var url = 'http://api.duoshuo.com/oauth2/access_token';
    var infoUrl = "http://api.duoshuo.com/users/profile.json";
    async.waterfall(
        [
            function (callback) {
                superagent.post(url)
                    .type('form')
                    .accept('application/json')
                    .send({
                        client_id: config.site.duoshuo.short_name,
                        code: code
                    })
                    .end(function (err, xhr) {
                        callback(err, xhr.body);
                    });
            },
            function (dsUser, callback) {
                superagent.get(infoUrl)
                    .query({user_id: dsUser.user_id})
                    .end(function (err, xhr) {
                        callback(err, xhr.body);
                    });
            }
        ],
        function (error, userInfo) {

            var obj = {
                short_name: config.site.duoshuo.short_name,
                user_key: userInfo.response.user_id,
                name: userInfo.response.name
            };

            var duoshuo_token = jwt.encode(obj, 'a96576a72e54d62a1f36a69dc9234b8c');
            res.cookie('duoshuo_token', duoshuo_token, {maxAge: 60 * 1000 * 60 * 24 * 7});
            req.flash(config.constant.flash.success, '欢迎登录, ' + userInfo.response.name);
            res.redirect('/');
        }
    );


});

/**
 * SSO登出
 */
router.get('/sso-logout', function (req, res, next) {
    res.redirect('/logout');
});

/**
 * 更多访客
 */
router.get('/more-visitor', function (req, res) {
    res.render('more-visitor');
});

/**
 * 获取首页段子
 */
router.get('/duanzi', function (req, res) {
    superagent.get('https://github.com/loverajoel/jstips/').end(function (err, xhr) {
        var $ = cheerio.load(xhr.text);
        var html = $('#user-content-tips-list').closest('h1').next('ul').find('li').html();
        res.send(html);
    });
});
module.exports = router;
