var express = require('express');
var webHelper = require('../lib/webHelper');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var Article = global.dbHelper.getModel('article');
    Article.find(function (error, doc) {
        webHelper.reshook(req, res, next, error, function () {
            res.render('index', {
                articles: doc
            });
        });
    });

});

module.exports = router;
