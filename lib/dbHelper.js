/**
 * Created by gefan on 2016/1/14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./models');

for(var m in models){
    mongoose.model(m, new Schema(models[m]));
}

var _getModel = function (type) {
    return mongoose.model(type);
};

module.exports = {
    getModel: function (type) {
        return _getModel(type);
    },
    getArticle: function(){
        return _getModel('article');
    }
};