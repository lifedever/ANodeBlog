var moment = require('moment');
var gravatar = require('gravatar');
var lodash = require('lodash');

'use strict';

moment.locale('zh-cn');

module.exports = {
    /**
     * 定义局部文件
     * @param name
     * @param block
     * @returns {null}
     */
    section: function (name, block) {
        if (!this._sections) this._sections = {};
        this._sections[name] = block.fn(this);
        return null;
    },
    /**
     * 自动接取文章摘要
     * @param content
     */
    articleDesc: function (content) {
        if (!content)
            content = '';
        var re = /<[^>]+>/gi;
        str = content.replace(re, '');
        return str.substr(0, 100);
    },
    /**
     * 时间格式化显示
     */
    timeFromNow: function (date) {
        return moment(date).fromNow();
    },
    /**
     * +1
     * @param index
     * @returns {*}
     */
    addOne: function (index) {
        return index + 1;
    },
    add: function (value1, value2) {
        return Number(value1) + Number(value2);
    },
    reduce: function (value1, value2) {
        return Number(value1) - Number(value2);
    },
    /**
     * 格式化日期
     * @param date
     * @param fmt
     * @returns {*}
     */
    formatDate: function (date, fmt) { //author: meizz
        if (date == undefined) {
            return;
        }
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

    /**
     * 转数字
     * @param value
     */
    number: function(value) {
        return Number(value);
    },

    /**
     * 判断相等
     * @param value1
     * @param value2
     * @param options
     * @returns {*}
     */
    equals: function (value1, value2, block) {
        if(Number(value1))
            value1 = Number(value1);
        if(Number(value2))
            value2 = Number(value2);

        if (value1 == value2) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    /**
     * 渲染全球通用头像
     * @param email
     * @returns {*}
     */
    gravatar: function (email) {
        var url = gravatar.url(email, {s: '100', r: 'G', d: 'retro'});
        url = lodash.replace(url, 'www.gravatar.com', 'gravatar.duoshuo.com');
        return url;
    },
    /**
     * 遍历数字
     * @param n
     * @param block
     * @returns {string}
     */
    times: function (n, begin, end, block) {
        if (!begin)
            begin = 0;
        if (!end)
            end = n - 1;
        var accum = '';
        for (var i = begin; i <= end; ++i) {
            this.step = i;
            accum += block.fn(this);
        }
        return accum;
    },
    /**
     * 小于
     * @param value1
     * @param value2
     * @param block
     */
    lt: function (value1, value2, block) {
        if (Number(value1) < Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    /**
     * 小于等于
     * @param value1
     * @param value2
     * @param block
     */
    le: function (value1, value2, block) {
        if (Number(value1) <= Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    /**
     * 大于
     * @param value1
     * @param value2
     * @param block
     */
    gt: function (value1, value2, block) {
        if (Number(value1) > Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    /**
     * 大于等于
     * @param value1
     * @param value2
     * @param block
     */
    ge: function (value1, value2, block) {
        if (Number(value1) >= Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    contains: function (array, value, options) {
        array = ( array instanceof Array ) ? array : [array];
        return (array.indexOf(value) > -1) ? options.fn(this) : options.inverse(this);
    },
    tags: function(tags) {
        var classes = ['label-info', 'label-warning', 'label-success', 'label-primary'];

        var tagArr = lodash.split(tags, ',');
        for(var i=0; i< tagArr.length; i++) {

        }
        return
    }
};