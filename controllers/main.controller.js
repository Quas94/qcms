/**
 * Controller for the homepage.
 */
module.exports = function(req, res) {
    // fetch theme from session
    if (req.session.theme === undefined) {
        req.session.theme = 'light';
    }
    var theme = req.session.theme;

    res.render('main', {
        theme: theme
    });
};
