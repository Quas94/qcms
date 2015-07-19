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

var getSinglePostInternal = function(req, res) {
    PostModel.find({
        _id: req.params.postId
    }, function(err, post) {
        if (err) res.send(err);

        res.json(post);
    });
};

exports.getSinglePost = getSinglePostInternal;

exports.createComment = function(req, res) {
    console.log('Trying to insert comment into post id = ' + req.params.postId + '. Body is ' + req.body.body);
    // TODO prevent injection attacks
    PostModel.findOneAndUpdate({
        _id: req.params.postId
    }, {
        $push: {
            comments: {
                author: req.body.author,
                body: req.body.body,
                date: Date.now()
            }
        }
    }, {
        new: true // make this query return updated post
    }, function(err, post) {
        if (err) res.send(err);
        // return update post info
        res.json(post);
        console.log('Successfully updated post. response post is: ' + JSON.stringify(post));
    });
}

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
