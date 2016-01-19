/**
 * Created by gefan on 2016/1/14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./models');
var utils = require('utility');
var Promise = require("bluebird");

var _getUser = function () {
    var userSchema = new Schema(models.user);
    userSchema.methods.validPassword = function (password) {
        return utils.md5(password, 'base64') == this.password;
    };
    var User = mongoose.model('User', userSchema);
    return Promise.promisifyAll(User);
};

var _getArticle = function () {
    var articleSchema = new Schema(models.article);
    var Article = mongoose.model('Article', articleSchema);
    return Promise.promisifyAll(Article);
};

module.exports = {
    User: _getUser(),
    Article: _getArticle()
};