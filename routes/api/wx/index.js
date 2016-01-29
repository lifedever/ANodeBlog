var express = require('express');
var wx = require('wechat');
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

router.post('/', function (req, res) {
    var wxApi = req.body;
    if (wxHelper.checkSignature(wxApi.signature, wxApi.timestamp, wxApi.nonce)) {
        var reply = "<xml>" +
            "<ToUserName>" + wxApi.ToUserName + "</ToUserName>" +
            "<FromUserName>" + wxApi.FromUserName + "</FromUserName>" +
            "<CreateTime>12345678</CreateTime>" +
            "<MsgType>text</MsgType>" +
            "<Content>meg: " + wxApi.Content + "</Content>" +
            "</xml>";
        res.send(reply);
    } else {
        res.send('auth failed!');
    }

});

module.exports = router;
