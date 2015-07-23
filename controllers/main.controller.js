/**
 * Controller for the homepage.
 */
var themeModel = require('../models/theme.model');

module.exports = function(req, res) {
    var theme = themeModel.getTheme(req);

    res.render('main', {
        theme: theme
    });
};
