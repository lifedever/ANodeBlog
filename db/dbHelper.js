/**
 * Created by gefan on 2016/1/14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('utility');
var Promise = require("bluebird");

var _getUser = function () {
    /* 用户定义 */
    var userSchema = new Schema({
        username: {type: String, required: true, unique: true},// 用户名
        password: {type: String, required: true},
        email: {type: String},  // 邮箱
        website: {type: String},    // 个人网站
        address: {type: String},    // 所在地点
        github: {type: String}, // github
        signature: {type: String},  // 个人签名
        job: {type: String},        // 职业,
        created_time: {type: Date, default: Date.now}   // 创建时间
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });
    userSchema.methods.validPassword = function (password) {
        return utils.md5(password, 'base64') == this.password;
    };
    var User = mongoose.model('User', userSchema);
    return Promise.promisifyAll(User);
};

var _getArticle = function () {
    /*评论定义*/
    var commentSchema = new Schema({
        _user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {type: String, required: true},

    }, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

    /*文章定义*/
    var articleSchema = new Schema({
        title: {type: String, required: true},              // 标题
        content: {type: String},                            // 内容
        up: {type: Boolean, default: false},                // 置顶
        recommend: {type: Boolean, default: false},         // 推荐
        html: {type: String},                               // 转化后的内容
        index: {type: String},                              // 目录索引
        views: {type: Number, default: 0},                  // 阅读数
        favorite: {type: Number, default: 0},               // 喜欢数
        created_time: {type: Date, default: Date.now},      // 创建时间
        _user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        children: [commentSchema]
    }, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});
    var Article = mongoose.model('Article', articleSchema);
    return Promise.promisifyAll(Article);
};

module.exports = {
    User: _getUser(),
    Article: _getArticle()
};