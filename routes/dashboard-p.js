var express = require('express');
var passport = require('passport');

var async = require('async');
var webHelper = require('../lib/webHelper');
var dbHelper = require('../db/dbHelper');
var articleDao = require('../db/articleDao');
var authority = require('../lib/authority');
var config = require('../config');
var lodash = require('lodash');


var router = express.Router();
var Article = dbHelper.Article;
var User = dbHelper.User;

var md = webHelper.Remarkable();

router.get('/', function (req, res, next) {
    articleDao.findArticlesByUser(req.session.user._id, function (articles) {
        res.render('dashboard/p/list', {articles: articles, menu: 'p-list', layout: 'dashboard'});
    });
});

router.get('/create', function (req, res, next) {
    res.render('dashboard/p/create', {
        menu: 'p-list',
        types: config.article.types,
        layout: 'dashboard'
    });
});

router.post('/create', function (req, res, next) {
    var article = req.body;
    article._user = req.session.user._id;
    articleDao.saveOrUpdate(article, function (error, doc) {
        webHelper.reshook(error, next, function () {
            req.flash(config.constant.flash.success, '文章添加成功!');
            res.redirect('/dashboard/p');
        });
    });
});

/**
 * 发表分享
 */
router.get('/create-share', function (req, res, next) {
    res.render('dashboard/p/create-share', {
        menu: 'p-list',
        types: config.article.types,
        layout: 'dashboard'
    });
});

router.post('/create/preview', function (req, res) {
    var content = req.body.content;
    res.send(md.render(content));
});

router.get('/delete/:id', function (req, res, next) {
    var id = req.params.id;
    Article.findById(id, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                webHelper.reshook(err, next, function () {
                    req.flash(config.constant.flash.success, '文章删除成功!');
                    res.redirect('/dashboard/p');
                });
            });
        } else {
            var error = new Error('cannot find the article which id is [' + id + ']');
            error.status = 500;
            next(error);
        }
    });
});

router.get('/edit/:id', function (req, res, next) {
    var id = req.params.id;
    Article.findById(id, function (err, doc) {
        if (doc) {
            res.render('dashboard/p/create', {
                menu: 'p-list',
                article: doc,
                types: config.article.types,
                layout: 'dashboard'
            })
        } else {
            var error = new Error('cannot find the article which id is [' + id + ']');
            error.status = 500;
            next(error);
        }
    });
});

/**
 * 置顶
 */
router.get('/up/:id', function (req, res, next) {
    var id = req.params.id;
    var up = req.query.up;
    if (up && up == 'true') {
        up = false;
    } else {
        up = true;
    }
    Article.update({_id: id}, {up: up}, function (err, raw) {
        if (err) {
            next(err);
        } else {
            res.redirect('/dashboard/p');
        }
    });
});

/**
 * 推荐
 */
router.get('/recommend/:id', function (req, res, next) {
    var id = req.params.id;
    var recommend = req.query.recommend;

    if (recommend && recommend == 'true') {
        recommend = false;
    } else {
        recommend = true;
    }

    Article.update({_id: id}, {recommend: recommend}, function (err, raw) {
        if (err) {
            next(err);
        } else {
            res.redirect('/dashboard/p');
        }
    });
});

module.exports = router;