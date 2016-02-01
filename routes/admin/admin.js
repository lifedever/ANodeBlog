var express = require('express');
var router = express.Router();
var dbHelper = require('../../db/dbHelper');

router.get('/', function (req, res, next) {
    res.render('dashboard/index', {menu: 'index',layout: 'dashboard'});
});


module.exports = router;
