var express = require('express');
var router = express.Router();
var dbHelper = require('../../db/dbHelper');
var config = require('../../config');

router.get('/', function (req, res, next) {
    dbHelper.User.find({role: config.constant.role.user}).exec(function (err, users) {
        if (err) {
            next(err);
        } else {
            res.render('dashboard/admin/user', {
                menu: 'index',
                users: users,
                layout: 'dashboard'
            });
        }
    });
});

router.get('/disabled/:id/:status', function (req, res, next) {
    var id = req.params.id;
    var status = req.params.status == 'true'? true : false;
    dbHelper.User.update({_id: id}, {status: !status}, function (err, doc) {
        if(err) {
            next(err);
        }else {
            req.flash(config.constant.flash.success, '操作成功');
            res.redirect('/admin/user');
        }
    });
});
module.exports = router;
