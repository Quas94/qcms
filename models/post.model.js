var mongoose = require('mongoose');

var PostModel = mongoose.model('BlogPost', {
    title: String,
    body: String,
    author: String,
    date: Date,
    meta: {
        upvotes: Number,
        downvotes: Number
    },
    category: String,
    tags: [String], // array of tags
    comments: [{
        author: String,
        body: String,
        date: Date
    }]
});

exports.model = PostModel;
