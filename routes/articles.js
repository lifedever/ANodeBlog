/**
 * Created by gefan on 2016/1/14.
 */
var express = require('express');
var authority = require('../lib/authority');
var webHelper = require('../lib/webHelper');
var config = require('../config');
var router = express.Router();


router.get('/create', authority.auth_login, function (req, res) {
    res.render('article/form');
});

router.post('/create', authority.auth_login, function (req, res) {
    var Article = global.dbHelper.getArticle();
    var title = req.body.title;
    var content = req.body.content;
    Article.create({
        title: title,
        content: content
    }, function (error, doc) {
        webHelper.reshook(error, next, function () {
            req.flash(config.constant.flash.success, '文章添加成功!');
            res.redirect('/');
        });
    });
});
router.get('/:id/delete', authority.auth_login, function (req, res, next) {
    var id = req.params.id;
    var Article = global.dbHelper.getArticle();
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
router.get('/:id', function (req, res, next) {
    var Article = global.dbHelper.getArticle();
    Article.findById(req.params.id, function (err, article) {
        webHelper.reshook(err, next, function () {
            res.render('article/view', {article: article});
        });
    });
});


module.exports = router;
