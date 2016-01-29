var utility = require('utility');
var config = require('../config');
'use strict';

var Token = config.wx.token;

module.exports = {
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
        oriArray[2] = Token;    //这里是你在微信开发者中心页面里填的token
        oriArray.sort();
        var original = oriArray.join('');
        var cyptoString = utility.sha1(original);
        return signature == cyptoString;
    }
};