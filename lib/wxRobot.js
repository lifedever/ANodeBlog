var lodash = require('lodash');
var dbHelper = require('../db/dbHelper');
var config = require('../config');
var tlRobot = require('./tlRobot');

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


var _replay = function (wx, res) {

    dbHelper.Robot.findOne({key: wx.Content.toLowerCase()}, function (err, doc) {
        if (doc) {
            res.reply({
                content: doc.value,
                type: 'text'
            });
        } else {
            tlRobot.reply(wx.Content, function (err, result) {
                result = JSON.parse(result);
                if (result.code == 100000) {    // 普通文字类
                    res.reply({
                        content: result.text,
                        type: 'text'
                    });
                }else if(result.code == 200000){    // 连接类
                    res.reply({
                        content: result.text+ ': ' + result.url,
                        type: 'text'
                    });
                }else if(result.code == 302000){    // 新闻类

                    res.reply({
                        content: result.text,
                        type: 'text'
                    });

                    var list = new Array();
                    for(var i=0; i<result.list.length; i++) {
                        var news = {
                            title: result.list[i].article,
                            description: result.list[i].source,
                            picurl: result.list[i].icon,
                            url: result.list[i].detailurl
                        };
                        list.push(news);
                    }
                    res.reply(list);

                } else {
                    res.reply({
                        content: config.wx.noSkill,
                        type: 'text'
                    });
                }
            })
        }
    });
};
module.exports = {
    reply: _replay
};