/**
 * Controller for the homepage.
 */
var ThemeModel = require('../models/theme.model');
var config = require('../config/config');

module.exports = function(req, res) {
    var theme = ThemeModel.getTheme(req);

    res.render('main', {
        theme: theme,
        title: config.blogTitle,
        desc: config.blogDesc
    });
};
