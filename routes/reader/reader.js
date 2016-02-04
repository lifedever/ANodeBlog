var express = require('express');
var dbHelper = require('../../db/dbHelper');
var config = require('../../config');
var async = require('async');
var router = express.Router();

router.get('/favorite', function (req, res, next) {
    var readerId = req.session.duoshuoUser._id;
    async.waterfall([
        function(callback){
            dbHelper.Reader.findById({_id: readerId}, function(err, reader) {
                callback(err, reader);
            })
        },
        function(reader, callback) {
            dbHelper.Article.find({_id: {$in: reader.favorites}}).populate('_user').exec(function(err, articles) {
                callback(err, reader, articles);
            });
        }
    ], function(err, reader, articles){
        res.render('reader/favorite', {
            count: articles.length,
            reader: reader,
            articles: articles
        })
    });
});

module.exports = router;