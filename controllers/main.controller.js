/**
 * Controller for the homepage.
 */
var ThemeModel = require('../models/theme.model');
var config = require('../config/config');

module.exports = function(req, res) {
    var theme = ThemeModel.getTheme(req);

    res.render('main', {
        // NOTE: if adding things to this template, also need to change in notfound.controller
        theme: theme,
        headTitle: config.headTitle,
        title: config.blogTitle,
        desc: config.blogDesc

        // sidebar variables are listed in view.controller
    });
};
