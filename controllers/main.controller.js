/**
 * Controller for the homepage.
 */
module.exports = function(req, res) {
    var active = ' class="active"';

    var homeActive = '';
    var aboutActive = '';
    if (req.path == '/home') {
        homeActive = active;
    } else {
        aboutActive = active;
    }

    res.render('main', {
        homeActive: homeActive,
        aboutActive: aboutActive
    });
};
