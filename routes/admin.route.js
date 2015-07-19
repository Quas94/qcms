/**
 * Router/controller for post creation. Temporary.
 */
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

    app.post('/login', function(req, res) {
        var username = 'quasar';
        var password = 'password123x';
        if (req.body.username != undefined && req.body.username.toLowerCase() === username && req.body.password === password) {
            req.session.loggedIn = true;
            res.send('Success');
        } else {
            res.send('Invalid login');
        }
    });
}
