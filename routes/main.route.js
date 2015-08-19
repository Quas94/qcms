/**
 * Router for the main skeleton of the page
 */
var main = require('../controllers/main.controller');

// all additional pages - TODO place this stuff in db so no hardcoding
var allPages = [ 'projects', 'about', 'contact' ];

module.exports = function(app) {
    // app.get('/home', main);
    app.get('/blog/:id', main);
    app.get('/blog', main);
    app.get('/about', main);
    app.get('/contact', main);
    // loop through and add all the pages in page router
    for (var i = 0; i < allPages.length; i++) {
        app.get('/' + allPages[i], main);
    }
};
