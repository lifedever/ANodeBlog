/**
 * Created by gefan on 2016/1/14.
 */
var express = require('express');
var router = express.Router();


router.get('/create', function(req, res){
    res.render('article/form');
});

router.post('/create', function (req, res) {
    var Article = global.dbHelper.getArticle();
    var title = req.body.title;
    var content = req.body.content;
    Article.create({
        title: title,
        content: content
    }, function(error, doc){
        if(error){
            res.send(error)
        }else{
            req.flash('flash_success_message', '文章添加成功!');
            res.redirect('/');
        }
    });
});
router.get('/:id/delete', function (req, res) {
    var id = req.params.id;
    var Article = global.dbHelper.getArticle();
    Article.findById(id, function (err, doc) {
        doc.remove(function(err, doc){
            if(err) {

            }else{
                res.redirect('/');
            }
        });
    });
});
router.get('/:id', function(req, res, next) {
    var Article = global.dbHelper.getArticle();
    Article.findById(req.params.id, function (err, article) {
        if(err){
            res.send(err);
        }else{
            res.render('article/view', {article: article});
        }
    });
});


module.exports = router;
