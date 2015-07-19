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
    // fetch params
    var author = req.body.author;
    var body = req.body.body;

    // check types to prevent exploits and injections
    if (typeof author === 'string' && typeof body === 'string') {
        // actually update db
        PostModel.findOneAndUpdate({
            _id: req.params.postId
        }, {
            $push: {
                comments: {
                    author: author,
                    body: body,
                    date: Date.now()
                }
            }
        }, {
            new: true // make this query return updated post
        }, function(err, post) {
            if (err) res.send(err);
            // return update post info
            res.json(post);
        });
    }
}

/**
 * Creates a new blog post. Needs admin logged in privileges.
 *
 * @param req Express.js request object
 * @param res Express.js response object
 */
exports.createPost = function(req, res) {
    if (req.session.loggedIn === true) {
        PostModel.create({
            title: req.body.title,
            body: req.body.body,
            author: req.body.author,
            date: Date.now()
        }, function (err, posts) {
            if (err) res.send(err);
            getPostsInternal(req, res);
        })
    }
};

/**
 * Deletes an existing blog post. Needs admin logged in privileges.
 *
 * @param req Express.js request object
 * @param res Express.js response object
 */
exports.deletePost = function(req, res) {
    if (req.session.loggedIn === true) {
        PostModel.remove({
            _id: req.params.postId
        }, function(err, posts) {
            if (err) res.send(err);
            getPostsInternal(req, res);
        });
    }
}
