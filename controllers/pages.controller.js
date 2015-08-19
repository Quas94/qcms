/**
 * Controller for additional pages content.
 */

var PagesModel = require('../models/pages.model').model;

exports.getAdditionalPage = function(req, res) {
    console.log('fetching ' + req.params.pageId);
    PagesModel.findOne({
        page: req.params.pageId
    }, function (err, add) {
        if (err) res.send(err);
        res.json(add);
    });
};

var getAllAdditionalPagesInternal = function(req, res) {
    PagesModel.find(function(err, pages) {
        if (err) res.send(err);
        res.json(pages);
    });
};

exports.getAllAdditionalPages = getAllAdditionalPagesInternal;

/**
 * TODO: finish making pages completely db-reliant with zero hardcoding
 */
exports.createPage = function(req, res) {
    if (req.session.loggedIn === true) {
        PagesModel.create({
            page: req.body.page,
            title: req.body.title,
            content: req.body.content
        }, function(err, pages) {
            if (err) res.send(err);
            getAllAdditionalPagesInternal(req, res);
        });
    }
};

exports.editPage = function(req, res) {
    if (req.session.loggedIn === true) {
        PagesModel.findOneAndUpdate({
            _id: req.params.pageId
        }, {
            page: req.body.page,
            title: req.body.title,
            content: req.body.content
        }, {
            new: true // make this query return updated post
        }, function (err, post) {
            if (err) res.send(err);
            // return update post info
            res.json(post);
        });
    }
}

exports.deletePage = function(req, res) {
    if (req.session.loggedIn === true) {
        PagesModel.remove({
            _id: req.params.pageId
        }, function(err, pages) {
            if (err) res.send(err);
            getAllAdditionalPagesInternal(req, res);
        });
    }
}
