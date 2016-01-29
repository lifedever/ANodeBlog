var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var async = require('async');
var config = require('../config');

router.get('/', function (req, res, next) {
    dbHelper.Robot.find().exec(function (err, doc) {
        if (err) {
            next(err);
        } else {
            res.render('dashboard/robot/index', {
                robots: doc,
                layout: 'dashboard',
                menu: 'robot'
            })
        }
    });
});

router.post('/', function (req, res, next) {
    var robot = req.body;

    dbHelper.Robot.find({key: robot.key}, function (err, doc) {
        if (err) {
            next(err);
        } else {
            if(doc.length == 0){
                dbHelper.Robot.create(robot, function (err, doc) {
                    if (err) {
                        next(err);
                    } else {
                        res.redirect('/dashboard/robot');
                    }
                });
            }else{
                req.flash(config.constant.flash.error, '规则已存在!');
                res.redirect('/dashboard/robot');
            }
        }
    });

});

router.get('/delete/:id', function (req, res, next) {
    var id = req.params.id;
    dbHelper.Robot.remove({_id: id}, function (err, doc) {
        res.redirect('/dashboard/robot');
    });
});

module.exports = router;
