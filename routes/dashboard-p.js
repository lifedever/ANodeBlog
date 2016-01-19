var express = require('express');
var passport = require('passport');
var Remarkable = require('remarkable');
var hljs = require('highlight.js');
var webHelper = require('../lib/webHelper');
var articleDao = require('../db/articleDao');
var authority = require('../lib/authority');
var config = require('../config');

var router = express.Router();

var md = new Remarkable({
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
    articleDao.findArticlesByUser(req.session.passport.user._id, function(articles){
        res.render('dashboard/p/list', {articles: articles, layout: 'dashboard'});
    });
});

router.get('/create', function (req, res, next) {
    res.render('dashboard/p/create', {layout: 'dashboard'});
});

router.post('/create', authority.isAuthenticated, function (req, res, next) {
    var Article = global.dbHelper.Article;
    var title = req.body.title;
    var content = req.body.content;
    Article.create({
        title: title,
        content: content,
        html: md.render(content),
        _user: req.session.passport.user._id
    }, function (error, doc) {
        webHelper.reshook(error, next, function () {
            req.flash(config.constant.flash.success, '文章添加成功!');
            res.redirect('/dashboard/p/create');
        });
    });
});

router.get('/:id/delete', authority.isAuthenticated, function (req, res, next) {
    var id = req.params.id;
    var Article = global.dbHelper.Article;
    Article.findById(id, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                webHelper.reshook(err, next, function () {
                    req.flash(config.constant.flash.success, '文章删除成功!');
                    res.redirect('/');
                });
            });
        } else {
            var error = new Error('cannot find the article which id is [' + id + ']');
            error.status = 500;
            next(error);
        }
    });
});


module.exports = router;