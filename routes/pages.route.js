/**
 * Router for additional pages.
 */

var pageController = require('../controllers/pages.controller');
var pages = '/pages/';

module.exports = function(app) {
    // get all pages
    app.get('/pages', pageController.getAllAdditionalPages);
    app.get('/pages/:pageId', pageController.getAdditionalPage);
    app.post('/pages', pageController.createPage);
    app.post('/pages/:pageId', pageController.editPage);
    app.delete('/pages/:pageId', pageController.deletePage);
};
