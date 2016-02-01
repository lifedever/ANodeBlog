/*权限验证中间件*/
var config = require('../config');

'use strict';

module.exports = {
    /**
     * 登陆权限验证
     */
    isAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }else{
            req.flash(config.constant.flash.error, '请先登录!');
            res.redirect('/login');
        }
    },
    isAdmin: function(req, res, next) {
        var user = req.session.user;
        if(user && user.role === config.constant.role.admin) {
            return next();
        }else{
            req.flash(config.constant.flash.error, '禁止访问!');
            res.redirect('/');
        }
    }
};