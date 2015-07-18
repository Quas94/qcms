/**
 * Router for the main skeleton of the page
 */
var main = require('../controllers/main.controller');

module.exports = function(app) {
    app.get('/home', main);
    app.get('/blog/:id', main);
    app.get('/blog', main);
    app.get('/about', main);
    app.get('/contact', main);
};
