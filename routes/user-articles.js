/**
 * Created by gefan on 2016/1/18.
 */
var express = require('express');
var passport = require('passport');
var webHelper = require('../lib/webHelper');
var authority = require('../lib/authority');
var config = require('../config');
var router = express.Router();

router.get('/create', authority.isAuthenticated, function (req, res) {
    res.render('article/form');
});

router.post('/create',authority.isAuthenticated, function (req, res, next) {
    var Article = global.dbHelper.Article;
    var title = req.body.title;
    var content = req.body.content;
    Article.create({
        title: title,
        content: content,
        _user: req.session.passport.user._id
    }, function (error, doc) {
        webHelper.reshook(error, next, function () {
            req.flash(config.constant.flash.success, '文章添加成功!');
            res.redirect('/');
        });
    });
});

router.get('/:id/delete',authority.isAuthenticated, function (req, res, next) {
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

router.get('/')

module.exports = router;
