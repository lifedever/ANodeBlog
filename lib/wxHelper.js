var utility = require('utility');
var config = require('../config');
var dbHelper = require('../db/dbHelper');

'use strict';

module.exports = {
    loadWX: function () {

        global.wx = {
            token: 'thoughyg20150101',
            appid: 'wxb595291ff33c6b21',
            encodingAESKey: 'J4XXSEnTygKLEwklT6GdIFGIp7wmmZnbv7O7T5x7lpy'
        };
    },
    /**
     * 校验微信接口
     * @param signature
     * @param timestamp
     * @param nonce
     * @returns {boolean}
     */
    checkSignature: function (signature, timestamp, nonce) {
        var oriArray = new Array();
        oriArray[0] = nonce;
        oriArray[1] = timestamp;
        oriArray[2] = global.wx.token;    //这里是你在微信开发者中心页面里填的token
        oriArray.sort();
        var original = oriArray.join('');
        var cyptoString = utility.sha1(original);
        return signature == cyptoString;
    }
};