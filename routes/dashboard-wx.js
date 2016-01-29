var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var wxHelper = require('../lib/wxHelper');

router.get('/', function (req, res, next) {
    dbHelper.WX.find().exec(function (err, doc) {
        if (err) {
            next(err);
        } else {
            res.render('dashboard/wx/index', {
                wx: doc[0],
                layout: 'dashboard',
                menu: 'wx'
            })
        }
    });
});
router.post('/', function (req, res, next) {
    var wx = req.body;
    if (wx.id == '') {
        dbHelper.WX.create({
            token: wx.token,
            appid: wx.appid,
            encodingAESKey: wx.encodingAESKey
        },function (err, doc) {
            if (err) {
                next(err);
            } else {
                wxHelper.loadWX();
                res.redirect('/dashboard/wx');
            }
        });
    } else {
        dbHelper.WX.update({_id: wx.id}, {
            token: wx.token,
            appid: wx.appid,
            encodingAESKey: wx.encodingAESKey
        }).exec(function (err, doc) {
            if (err) {
                next(err);
            } else {
                wxHelper.loadWX();
                res.redirect('/dashboard/wx');
            }
        });
    }
});
module.exports = router;
