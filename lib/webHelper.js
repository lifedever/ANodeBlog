var Remarkable = require('remarkable');
var hljs = require('highlight.js');

'use strict';

module.exports = {
    reshook: function (error, next, callback, errorCallback) {
        if (error) {
            if (errorCallback) {
                errorCallback();
            } else {
                error.status = 500;
                next(error);
            }
        } else {
            callback();
        }
    },
    Remarkable: function () {
        return new Remarkable('full', {
            linkify: true,         // autoconvert URL-like texts to links
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (err) {
                    }
                }

                try {
                    return hljs.highlightAuto(str).value;
                } catch (err) {
                }

                return ''; // use external default escaping
            }
        });
    }
};