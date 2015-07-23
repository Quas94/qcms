/**
 * Router for the 404 page
 */
var notFound = require('../controllers/notfound.controller');

module.exports = function(app) {
    // not found ng-view
    app.get('/view/not-found', notFound.view);

    // catch-all route, since it's added at the very end
    app.get('*', notFound.main);
};
