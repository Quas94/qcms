/**
 * Controller for post-related stuff
 */

var PostModel = require('../models/post.model').model;

var getPostsInternal = function(req, res) {
    PostModel.find(function(err, posts) {
        if (err) res.send(err);

        res.json(posts);
    });
};

exports.getPosts = getPostsInternal;

exports.createPost = function(req, res) {
    PostModel.create({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
        date: Date.now()
    }, function(err, posts) {
        if (err) res.send(err);
        getPostsInternal(req, res);
    })
};

exports.deletePost = function(req, res) {
    PostModel.remove({
        _id: req.params.postId
    }, function(err, posts) {
        if (err) res.send(err);
        getPostsInternal(req, res);
    });
}
