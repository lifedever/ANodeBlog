var dbHelper = require('./dbHelper');

module.exports = {
    findArticlesByUser: function (userId, callback) {
        var Article = dbHelper.Article;
        Article.find({_user: userId}).sort({'created_time': 'desc'}).then(function (doc) {
            callback(doc);
        });
    },
    saveOrUpdate: function (article, callback) {
        var Article = dbHelper.Article;
        if (article.id) {

            Article.update({
                _id: article.id
            }, article, function (error, doc) {
                callback(error,doc);
            });
        }else{
            Article.create(article, function (error, doc) {
                callback(error,doc);
            });
        }
    }
};