/**
 * Controller for the 404 page. Mirrors the main controller, with the exception of the status code change.
 */
var themeModel = require('../models/theme.model');

exports.view = function(req, res) {
    res.render('not_found');
};

exports.main = function(req, res) {
    var theme = themeModel.getTheme(req);

    res.status(404).render('main', {
        theme: theme
    });
};
