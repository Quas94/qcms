/**
 * Router/controller for post creation. Temporary.
 */
module.exports = function(app) {
    app.get('/create', function(req, res) {
        res.render('create');
    });
}
