/**
 * Created by gefan on 2016/1/14.
 */
var express = require('express');
var webHelper = require('../lib/webHelper');
var config = require('../config');
var router = express.Router();

router.get('/:id', function (req, res, next) {
    var Article = global.dbHelper.Article;
    Article.findById(req.params.id).exec(function (err, article) {
        webHelper.reshook(err, next, function () {
            res.render('article/view', {article: article});
        });
    });
});


module.exports = router;
