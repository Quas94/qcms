/**
 * Controller for views. Renders requested view
 */

exports.home = function(req, res) {
    res.render('home');
};

exports.about = function(req, res) {
    res.render('about');
};
