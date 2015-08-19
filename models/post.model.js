/**
 * Mongoose model of a blog post.
 *
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');

var PostModel = mongoose.model('BlogPost', {
    title: String,
    path: { type: String, index: true }, // readable url
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
