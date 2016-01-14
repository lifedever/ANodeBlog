var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var Article = global.dbHelper.getModel('article');
    Article.find(function(error, doc){
        if(error){

        }else{
            res.render('index', {
                articles: doc
            });
        }
    });

});

module.exports = router;
