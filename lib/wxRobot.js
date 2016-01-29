var lodash = require('lodash');
var dbHelper = require('../db/dbHelper');
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

var noSkill = "没有此技能，请关注网站: http://wincn.net了解更多!";

var _replay = function (wx, res) {

    dbHelper.Robot.findOne({key: wx.Content.toLowerCase()}, function (err, doc) {
        var result = doc || noSkill;

        res.reply({
            content: result,
            type: 'text'
        });
    });

};
module.exports = {
    reply: _replay
};