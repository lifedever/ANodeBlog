var express = require('express');
var dbHelper = require('../../db/dbHelper');
var config = require('../../config');
var router = express.Router();

/**
 * 添加收藏
 */
router.get('/:id/favorite/add', function (req, res, next) {
    var duoshuoUser = req.session.duoshuoUser;
    var id = req.params.id;

    dbHelper.Reader.update({_id: duoshuoUser._id}, {$addToSet: {favorites: id}}, function(err, raw) {
        if(err) {
            next(err);
        }else{
            res.send('添加收藏成功!');
        }
    })
});

/**
 * 移除收藏
 */
router.get('/:id/favorite/remove', function (req, res, next) {
    var duoshuoUser = req.session.duoshuoUser;
    var id = req.params.id;

    dbHelper.Reader.update({_id: duoshuoUser._id}, {$pull: {favorites: id}}, function(err, raw) {
        if(err) {
            next(err);
        }else{
            res.send('取消收藏!');
        }
    })
});
module.exports = router;
