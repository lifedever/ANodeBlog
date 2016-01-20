var express = require('express');
var passport = require('passport');
var Remarkable = require('remarkable');
var hljs = require('highlight.js');
var async = require('async');
var webHelper = require('../lib/webHelper');
var articleDao = require('../db/articleDao');
var authority = require('../lib/authority');
var config = require('../config');

var router = express.Router();

var md = new Remarkable('full', {
    linkify: true,         // autoconvert URL-like texts to links
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {
            }
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) {
        }

        return ''; // use external default escaping
    }
});

router.get('/', function (req, res, next) {
    articleDao.findArticlesByUser(req.session.passport.user._id, function (articles) {
        res.render('dashboard/p/list', {articles: articles, menu: 'p-list', layout: 'dashboard'});
    });
});

router.get('/create', function (req, res, next) {
    res.render('dashboard/p/create', {menu: 'p-list', layout: 'dashboard'});
});

router.post('/create', function (req, res, next) {
    var Article = global.dbHelper.Article;
    var title = req.body.title;
    var content = req.body.content;
    var id = req.body.id;
    articleDao.saveOrUpdate({
        id: id,
        title: title,
        content: content,
        html: md.render(content),
        _user: req.session.passport.user._id
    }, function (error, doc) {
        webHelper.reshook(error, next, function () {
            req.flash(config.constant.flash.success, '文章添加成功!');
            res.redirect('/dashboard/p');
        });
    });
});

router.post('/create/preview', function (req, res) {
    var content = req.body.content;
    res.send(md.render(content));
});

router.get('/delete/:id', function (req, res, next) {
    var id = req.params.id;
    var Article = global.dbHelper.Article;
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
    var Article = global.dbHelper.Article;
    Article.findById(id, function (err, doc) {
        if (doc) {
            res.render('dashboard/p/create', {menu: 'p-list', article: doc, layout: 'dashboard'})
        } else {
            var error = new Error('cannot find the article which id is [' + id + ']');
            error.status = 500;
            next(error);
        }
    });
});

module.exports = router;