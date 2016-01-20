var dbHelper = require('./dbHelper');

module.exports = {
    findArticlesByUser: function (userId, callback) {
        var Article = dbHelper.Article;
        Article.find({_user: userId}).sort({'created_time': 'desc'}).then(function (doc) {
            callback(doc);
        });
    }
};