/**
 * Controller for views. Renders requested view
 */
var ThemeModel = require('../models/theme.model');
var config = require('../config/config');

exports.sidebar = function(req, res) {
    var theme = ThemeModel.getTheme(req);

    var contactsNewWindow = [];
    var newWindow = 'target="_blank"';
    for (var media in config.contacts) {
        if (config.contacts[media] != config.NONE) {
            contactsNewWindow[media] = newWindow; // if not N/A, set to _blank
        } else {
            contactsNewWindow[media] = ''; // otherwise no target="_blank"
        }
    }

    res.render('sidebar', {
        theme: theme,

        // contact links
        contacts: config.contacts,
        contactsNewWindow: contactsNewWindow
    });
};

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
