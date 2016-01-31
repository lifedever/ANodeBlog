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
        if (doc) {                  // 查询系统预置的规则
            res.reply({
                content: doc.value,
                type: 'text'
            });
        }else if(lodash.startsWith(wx.Content, '@')){
            var keyword = wx.Content.substr(1);
            dbHelper.Article.find({title: new RegExp(keyword, 'i')}).exec(function(err, arts) {
                if(err){
                    res.reply({
                        content: err,
                        type: 'text'
                    })
                }else{
                    var artsList = new Array();
                    for(var i=0; i<arts.length; i++) {
                        var art = arts[i];
                        var url;
                        if(art.type == '分享'){
                            url = art.url;
                        }else{
                            url = 'http://wincn.net/p/'+art._id;
                        }

                        var art = {
                            title: art.article,
                            description: art.title,
                            type: 'text',
                            url: url
                        };
                        artsList.push(art);
                    }
                    res.reply(artsList);
                }
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

                    var newsList = new Array();
                    for(var i=0; i<result.list.length; i++) {
                        var news = {
                            title: result.list[i].article,
                            description: result.list[i].source,
                            picurl: result.list[i].icon,
                            url: result.list[i].detailurl
                        };
                        newsList.push(news);
                    }
                    res.reply(newsList);

                }else if(result.code == 308000){    // 菜谱类

                    var caisList = new Array();
                    for(var i=0; i<result.list.length; i++) {
                        var cais = {
                            title: result.list[i].name,
                            description: result.list[i].info,
                            picurl: result.list[i].icon,
                            url: result.list[i].detailurl
                        };
                        caisList.push(cais);
                    }
                    res.reply(caisList);

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