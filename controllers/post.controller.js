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
        // if not logged in as admin, prevent html markup in comment
        if (req.session.loggedIn != true) {
            body = convertSymbols(body);
        }
        // split up body into paragraphs according to double newline
        body = splitIntoParagraphs(body);

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
        // split tags by commas and trim all
        var tags = req.body.tags.split(',');
        for (var i = 0; i < tags.length; i++) {
            tags[i] = tags[i].trim();
        }
        PostModel.create({
            title: req.body.title,
            body: splitIntoParagraphs(req.body.body),
            author: req.body.author,
            date: Date.now(),
            category: req.body.category,
            tags: tags
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
        var body = req.body.body;
        var category = req.body.category;
        // split tags by commas and trim all
        var tags = String(req.body.tags).split(',');
        for (var i = 0; i < tags.length; i++) {
            tags[i] = tags[i].trim();
        }

        // update db
        PostModel.findOneAndUpdate({
            _id: postId
        }, {
            title: title,
            body: body,
            category: category,
            tags: tags
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

/**
 * Splits a body of text into paragraphs (adding p tag html markup) by splitting over double newline characters.
 */
function splitIntoParagraphs(body) {
    body = body.split('\n\n');
    var paragraphs = '';
    for (var i = 0; i < body.length; i++) {
        paragraphs = paragraphs.concat('<p>' + body[i] + '</p>');
    }
    return paragraphs;
}

/**
 * Converts HTML markup symbols into their respective &lt; and &gt; notations. Used for comments only, as admin posts
 * can embed HTML tags freely.
 */
function convertSymbols(body) {
    // ampersand first because it's contained in the &symbols;
    body = body.replace(new RegExp('&', 'g'), '&amp;');
    // then the rest
    body = body.replace(new RegExp('<', 'g'), '&lt;');
    body = body.replace(new RegExp('>', 'g'), '&gt;');
    body = body.replace(new RegExp('\'', 'g'), '&apos;');
    body = body.replace(new RegExp('"', 'g'), '&quot;');
    return body;
}
