var config = require('../config');
var lodash = require('lodash');
var superagent = require('superagent');

var noSkill = config.wx.noSkill;


var replay = function (msg, callback) {
    var url = config.tl.api + '?key=' + config.tl.key + '&info=' + msg;
    superagent.get(url).end(function (err, result) {
        callback(err, result);
    });
};

module.exports = {
    reply: replay
};