var lodash = require('lodash');
var dbHelper = require('../db/dbHelper');
var config = require('../config');
/**
 * 微信自动化
 * { ToUserName: 'gh_e5430b08c84f',
 *   FromUserName: 'oHEnvt_HTokkFkhQdKVgRclkXuW4',
 *   CreateTime: '1454047887',
 *   MsgType: 'text',
 *   Content: '额',
 *   MsgId: '6245088121887667909'
 * }
 */

var noSkill = config.wx.noSkill;

var _replay = function (wx, res) {

    dbHelper.Robot.findOne({key: wx.Content.toLowerCase()}, function (err, doc) {
        var result = doc.value || noSkill;

        res.reply({
            content: result,
            type: 'text'
        });
    });

};
module.exports = {
    reply: _replay
};