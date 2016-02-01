var express = require('express');
var async = require('async');
var router = express.Router();
var dbHelper = require('../../db/dbHelper');
var shortid = require('shortid');

router.get('/', function (req, res, next) {
    dbHelper.InviteCode.find(function(err, codes){
        if(err){
            next(err)
        }else{
            res.render('dashboard/admin/inviteCode', {
                menu: 'admin-inviteCode',
                codes: codes,
                layout: 'dashboard'
            });
        }
    });
});

router.get('/generate', function (req, res, next) {
    var number = Number(req.query.num);

    var codeArr = new Array();

    for(var i = 0; i< number; i++) {
        codeArr.push(shortid.generate());
    }

    async.each(codeArr, function (code, callback) {
        dbHelper.InviteCode.create({code: code}, function(err, doc){
            if(err) {
                callback(err);
            }else{
                callback();
            }
        })
    }, function(err){
        if(err){
            next(err);
        }else{
            res.redirect('/admin/inviteCode');
        }
    });

});

module.exports = router;
