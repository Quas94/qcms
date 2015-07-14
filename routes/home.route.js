/**
 * Router for the homepage.
 */
var home = require('../controllers/home.controller');

module.exports = function(app) {
    app.get('/home', home);
};
