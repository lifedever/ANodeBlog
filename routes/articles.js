/**
 * Created by gefan on 2016/1/14.
 */
var express = require('express');
var webHelper = require('../lib/webHelper');
var router = express.Router();


router.get('/create', function (req, res) {
    res.render('article/form');
});

router.post('/create', function (req, res) {
    var Article = global.dbHelper.getArticle();
    var title = req.body.title;
    var content = req.body.content;
    Article.create({
        title: title,
        content: content
    }, function (error, doc) {
        webHelper.reshook(req, res, next, error, function () {
            req.flash('flash_success_message', '文章添加成功!');
            res.redirect('/');
        });
    });
});
router.get('/:id/delete', function (req, res, next) {
    var id = req.params.id;
    var Article = global.dbHelper.getArticle();
    Article.findById(id, function (err, doc) {
        if (doc) {
            doc.remove(function (err, doc) {
                webHelper.reshook(req, res, next, err, function () {
                    req.flash('flash_success_message', '文章删除成功!');
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
        webHelper.reshook(req, res, next, err, function () {
            res.render('article/view', {article: article});
        });
    });
});


module.exports = router;
