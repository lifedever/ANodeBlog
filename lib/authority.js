/*权限验证中间件*/

'use strict';

module.exports = {
    /**
     * 登陆权限验证
     */
    auth_login: function (req, res, next) {
        if(!req.session.user) {
            req.flash('flash_error_message', '请先登录!');
            res.redirect('/')
        }else{
            next();
        }
    }
};