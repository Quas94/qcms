/**
 * Theme model - fetches current theme from session
 */
var DEFAULT_THEME = 'light';

exports.getTheme = function(req) {
    // fetch theme from session
    if (req.session.theme === undefined) {
        req.session.theme = DEFAULT_THEME;
    }
    var theme = req.session.theme;
    return theme;
}
