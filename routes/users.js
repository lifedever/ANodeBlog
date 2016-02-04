var express = require('express');
var router = express.Router();
var async = require('async');
var dbHelper = require('../db/dbHelper');

router.get('/user-popover/:userId', function (req, res, next) {
    var userId = req.params.userId;
    dbHelper.User.findById(userId).exec(function (err, user) {
        res.render('user-popover', {
            user: user,
            layout: null
        });
    });
});

/* GET users listing. */
router.get('/:username', function (req, res, next) {
    var username = req.params.username;
    var User = dbHelper.User;
    var Article = dbHelper.Article;
    async.waterfall([
        function (callback) {
            User.findOne({username: username}).exec(function (err, user) {
                callback(null, user);
            });
        },
        function (user, callback) {
            if (user) {
                Article.find({_user: user.id}).populate('_user').exec(function (err, articles) {
                    callback(null, articles, user);
                });
            } else {
                callback(null, null);
            }
        },
        function (articles, user, callback) {
            var userId = req.session.duoshuoUser ? req.session.duoshuoUser._id : null;
            dbHelper.Reader.findById(userId, function (err, reader) {
                callback(err,articles, user, reader);
            });
        }
    ], function (err, articles, user, reader) {
        res.render('my', {
            articles: articles,
            user: user,
            menu: 'my',
            reader: reader
        });
    });
});

module.exports = router;
