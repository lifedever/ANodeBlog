var moment = require('moment');
var gravatar = require('gravatar');
var lodash = require('lodash');
moment.locale('zh-cn');

module.exports = {
    /**
     * 时间格式化显示
     */
    timeFromNow: function (date) {
        return moment(date).fromNow();
    },
    addOne: function (index) {
        return index + 1;
    },
    formatDate: function (date, fmt) { //author: meizz
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    equals: function (value1, value2, options) {
        if(value1 === value2) {
            return options.fn(this);
        }else {
            return options.inverse(this);
        }
    },
    gravatar: function(email) {
        var url = gravatar.url(email, {s: '100', r: 'R', d: 'retro'});
        url = lodash.replace(url, 'www.gravatar.com', 'gravatar.duoshuo.com');
        return url;
    }
};