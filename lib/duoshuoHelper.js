var config = require('../config');
var dbHelper = require('../db/dbHelper');
var async = require('async');
var superagent = require('superagent');

'use strict';

module.exports = {
    login: function (obj, cb) {
        async.parallel({
            duosuoInfo: function (callback) {
                var infoUrl = "http://api.duoshuo.com/users/profile.json";
                superagent.get(infoUrl)
                    .query({user_id: obj.user_key})
                    .end(function (err, xhr) {
                        callback(err, xhr.body);
                    });
            },
            localInfo: function (callback) {
                dbHelper.Reader.findOne({duoshuo_id: obj.user_key}, function (err, user) {
                    callback(err, user);
                });
            }
        }, function (err, results) {
            cb(err, results);
        });
    }
};