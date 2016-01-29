var lodash = require('lodash');
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

var skills = {
    nodejs: "https://yunpan.cn/cr3DCNqt2ittu  访问密码 0dff"
};

var noSkill = "没有此技能，请关注网站: http://wincn.net了解更多!";

var getContent = function (key) {
    key = key.toLowerCase();
    var result = skills[key];
    return result | noSkill;
};

var _replay = function (wx, res) {
    res.reply({
        content: getContent(wx.Content),
        type: 'text'
    });
};
module.exports = {
    reply: _replay
};