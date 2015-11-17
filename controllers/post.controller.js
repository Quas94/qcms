/**
 * Controller for post-related stuff
 */

var PostModel = require('../models/post.model').model;

var util = require('../tools/util');

var getPostsInternal = function(req, res) {
    var conditions = {};
    if (!req.session.loggedIn) { // if not logged in, only show non-draft posts
        conditions.draft = false;
    }
    PostModel.find(conditions, function(err, posts) {
        if (err) res.send(err);

        res.json(posts);
    });
};

exports.getPosts = getPostsInternal;

var getSinglePostInternal = function(req, res) {
    var conditions = {
        path: req.params.postId
    };
    if (!req.session.loggedIn) { // if not logged in, only show non-draft posts
        conditions.draft = false;
    }
    PostModel.find(conditions, function (err, post) {
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
        // if not logged in as admin, prevent html markup in comment
        if (req.session.loggedIn != true) {
            body = util.convertSymbols(body);
        }
        // split up body into paragraphs according to double newline
        body = util.splitIntoParagraphs(body);

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
};

/**
 * Creates a new blog post. Needs admin logged in privileges.
 */
exports.createPost = function(req, res) {
    if (req.session.loggedIn === true) {
        // draft status
        var draft = req.body.draft;
        if (draft === undefined) draft = false;
        // initialise local tags as empty array
        var tags = [];
        // split tags by commas and trim all
        if (req.body.tags !== undefined) {
            tags = req.body.tags.split(',');
        }
        for (var i = 0; i < tags.length; i++) {
            tags[i] = tags[i].trim();
        }
        // process url path from title
        var path = req.body.title.toLowerCase();
        path = path.replace(new RegExp(' ', 'g'), '-'); // replace spaces with dash
        path = path.replace(new RegExp('[^a-zA-Z0-9\-]', 'g'), ''); // get rid of all non-alphanumeric/space chars
        // TODO: account for possible duplicate post titles/paths
        // actually insert into database
        PostModel.create({
            title: req.body.title,
            path: path,
            body: util.splitIntoParagraphs(req.body.body),
            author: req.body.author,
            date: Date.now(),
            category: req.body.category,
            tags: tags,
            draft: draft
        }, function (err, posts) {
            if (err) res.send(err);
            getPostsInternal(req, res);
        });
    }
};

/**
 * Updates an existing blog post. Requires admin logged in.
 */
exports.editPost = function(req, res) {
    if (req.session.loggedIn === true) {
        // edited posts need to be already html-formatted, so no manipulation required
        var postId = req.params.postId;
        var title = req.body.title;
        var path = req.body.path;
        var body = req.body.body;
        var category = req.body.category;
        var draft = req.body.draft;
        if (draft === undefined) draft = false;
        // initialise local tags as empty array
        var tags = [];
        // split tags by commas and trim all
        if (req.body.tags !== undefined) {
            tags = req.body.tags.split(',');
        }
        for (var i = 0; i < tags.length; i++) {
            tags[i] = tags[i].trim();
        }

        // update db
        PostModel.findOneAndUpdate({
            _id: postId
        }, {
            title: title,
            path: path,
            body: body,
            category: category,
            tags: tags,
            draft: draft
        }, {
            new: true // make this query return updated post
        }, function(err, post) {
            if (err) res.send(err);
            else res.end();
        });
    }
};

/**
 * Deletes an existing blog post. Needs admin logged in privileges.
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
};

/**
 * Deletes a comment from a blog post.
 */
exports.deleteComment = function(req, res) {
    if (req.session.loggedIn === true) {
        var postId = req.params.postId;
        var commentId = req.params.commentId;
        try {
            PostModel.findOneAndUpdate({
                _id: postId
            }, {
                $pull: {
                    comments: {_id: commentId}
                }
            }, {
                new: true
            }, function (err, post) {
                if (err) res.send(err);

                res.send(post);
            });
        } catch (err) {
            console.log(err);
        }
    }
};
