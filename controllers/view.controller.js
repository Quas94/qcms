/**
 * Controller for views. Renders requested view
 */
var themeModel = require('../models/theme.model');

exports.sidebar = function(req, res) {
    var theme = themeModel.getTheme(req);
    res.render('sidebar', {
        theme: theme
    });
}

exports.blogPost = function(req, res) {
    res.render('blog_post');
};

exports.blog = function(req, res) {
    res.render('blog');
};

exports.about = function(req, res) {
    res.render('about');
};

exports.contact = function(req, res) {
    res.render('contact');
};
