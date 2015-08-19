/**
 * Controller for views. Renders requested view
 */
var ThemeModel = require('../models/theme.model');

exports.sidebar = function(req, res) {
    var theme = ThemeModel.getTheme(req);
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

exports.projects = function(req, res) {
    res.render('projects');
};

exports.about = function(req, res) {
    res.render('about');
};

exports.contact = function(req, res) {
    res.render('contact');
};
