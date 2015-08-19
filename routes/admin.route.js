/**
 * Router/controller for post creation. Temporary.
 */
var config = require('../config/config');

module.exports = function(app) {
    app.get('/admin', function(req, res) {
        if (req.session.loggedIn === true) {
            res.render('admin');
        } else {
            res.redirect('login');
        }
    });
    app.get('/login', function(req, res) {
        if (req.session.loggedIn === true) {
            res.redirect('admin');
        } else {
            res.render('login');
        }
    });

    // TODO: make config file for password
    app.post('/login', function(req, res) {
        var username = config.adminUser;
        var password = config.adminPass;
        if (req.body.username != undefined && req.body.username.toLowerCase() === username.toLowerCase() && req.body.password === password) {
            req.session.loggedIn = true;
            res.send('Success');
        } else {
            res.send('Invalid login');
        }
    });
};
