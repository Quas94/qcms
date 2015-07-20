var dark = 'dark';
var light = 'light';

exports.changeTheme = function(req, res) {
    if (req.session.theme === undefined || req.session.theme === dark) {
        req.session.theme = light;
    } else {
        req.session.theme = dark;
    }
    res.redirect('/home');
};
