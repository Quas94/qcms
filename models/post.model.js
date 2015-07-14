var mongoose = require('mongoose');

var PostModel = mongoose.model('BlogPost', {
    title: String,
    body: String
});

exports.model = PostModel;
