/**
 * Created by gefan on 2016/1/14.
 */
var express = require('express');
var webHelper = require('../lib/webHelper');
var config = require('../config');
var async = require('async');
var router = express.Router();

router.get('/:id', function (req, res, next) {
    var Article = global.dbHelper.Article;
    var id = req.params.id;
    async.waterfall([
        function (callback) {
            Article.findById(id).populate('_user').exec(function (err, article) {
                callback(null, article);
            });
        },
        function (article, callback) {
            article.views += 1;
            Article.update({_id: id}, {views: article.views}, function (err, doc) {
                callback(null, article);
            });
        },
        function (article, callback) {
            Article.find({_user: article._user.id}).limit(10).sort({views: 1}).exec(function(err, docs){
                callback(null, article, docs);
            });
        }
    ], function (error, article, userHotArticles) {
        res.render('article/view', {
            article: article,
            userHotArticles: userHotArticles
        });
    });

});


module.exports = router;
