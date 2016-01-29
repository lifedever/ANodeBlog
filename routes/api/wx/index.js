var express = require('express');
var wxHelper = require('../../../lib/wxHelper');

var router = express.Router();

router.get('/', function (req, res, next) {
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;

    if (wxHelper.checkSignature(signature, timestamp, nonce)) {
        res.send(echostr);
    } else {
        res.send('false');
    }

});
module.exports = router;
