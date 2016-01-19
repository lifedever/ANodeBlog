var dbHelper = require('./dbHelper');

module.exports = {
    findArticlesByUser: function (userId, callback) {
        var Article = dbHelper.Article;
        Article.findAsync({_user: userId}).then(function (doc) {
            callback(doc);
        });
    }
};