var express = require('express');
var webHelper = require('../lib/webHelper');
var dbHelper = require('../db/dbHelper');
var config = require('../config');

var router = express.Router();

router.get('/', function (req, res, next) {
    dbHelper.User.findById(req.session.passport.user._id, function (err, user) {
        res.render('dashboard/u/index', {menu: 'u-info',user: user, layout: 'dashboard'});
    });
});

router.post('/', function (req, res, next) {

    dbHelper.User.findOneAndUpdate({_id: req.session.passport.user._id}, {
        website: req.body.website,    // 个人网站
        address: req.body.address,    // 所在地点
        github: req.body.github, // github
        job: req.body.job,      // 职业
        signature: req.body.signature  // 个人签名
    }, function (err, user) {
        if(!err) {
            req.flash(config.constant.flash.success, '修改成功!');
            res.redirect('/dashboard/u');
        }
    });
});

module.exports = router;