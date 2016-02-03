/**
 * Created by gefan on 2016/1/14.
 */
var express = require('express');
var webHelper = require('../lib/webHelper');
var dbHelper = require('../db/dbHelper');
var config = require('../config');
var async = require('async');

var router = express.Router();
var md = webHelper.Remarkable();

router.get('/:id', function (req, res, next) {
    var Article = dbHelper.Article;
    var id = req.params.id;
    async.waterfall([
        function (callback) {
            Article.findById(id).populate(['_user', 'children._user']).exec(function (err, article) {
                callback(null, article);
            });
        },
        function (article, callback) {

            if(article.isShared()){
                callback(null, article);
            }else{
                article.views += 1;
                Article.update({_id: id}, {views: article.views}, function (err, doc) {
                    callback(null, article);
                });
            }
        },
        // 热门文章
        function (article, callback) {
            if(article.isShared()){
                callback(null, article);
            }else {
                Article.find({_user: article._user.id}).limit(10).sort({views: -1}).exec(function (err, docs) {
                    callback(null, article, docs);
                });
            }
        }
    ], function (error, article, userHotArticles) {
        if(article.isShared()){
            res.redirect(article.url);
        }else{
            res.render('article/view', {
                article: article,
                userHotArticles: userHotArticles
            });
        }
    });

});

/**
 * 添加评论
 */
router.post('/:id/comment', function (req, res, next) {
    var Article = dbHelper.Article;
    var id = req.params.id;
    var content = req.body.content;

    async.waterfall([
        function(callback){
            Article.findById(id).exec(function (err, article) {
                callback(err, article);
            });
        },
        function(article, callback) {
            article.children.push({
                content: md.render(content),
                _user: req.session.user._id
            });
            article.save(function(err) {
                callback(err, article);
            })
        }
    ], function(err, article){
        if(!err) {
            res.redirect('/p/' + id + '#chat-box');
        }else{
            next(err);
        }
    })

});

module.exports = router;
