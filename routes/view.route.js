/**
 * Router for the views within the main page
 */

var viewController = require('../controllers/view.controller');
var view = '/view/';

module.exports = function(app) {
    app.get(view + 'home', viewController.home);
    app.get(view + 'about', viewController.about);
};
