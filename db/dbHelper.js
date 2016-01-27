/**
 * Created by gefan on 2016/1/14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('utility');
var Promise = require("bluebird");
var async = require('async');

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
        job: {type: String}         // 职业
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
        type: {type: String, default: '原创'},               // 类型
        created_time: {type: Date, default: Date.now},      // 创建时间
        updated_time: {type: Date, default: Date.now},      // 更新日期
        url: {type: String},                                // 相关链接
        source: {type: String},                             // 文章来源
        source_id:{type: String},                            // 资源唯一标识
        _user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        children: [commentSchema]
    }, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});
    var Article = mongoose.model('Article', articleSchema);
    return Promise.promisifyAll(Article);
};

/**
 *  对分页进行封装
 * @param page 当前页码，从1开始
 * @param pageSize 一页多少记录
 * @param Model Mongoose Model
 * @param populate populate参数
 * @param queryParams 查询参数
 * @param sortParams 排序参数
 * @param callback 回调函数
 */
var pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page
    };
    async.parallel({
        count: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录
            Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        var count = results.count;
        $page.pageCount = parseInt((count - 1) / pageSize + 1);
        $page.results = results.records;
        $page.count = count;
        callback(err, $page);
    });
};


module.exports = {
    User: _getUser(),
    Article: _getArticle(),
    Methods: {
        pageQuery: pageQuery
    }
};