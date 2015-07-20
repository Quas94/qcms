/**
 * Routing for setting changes (eg. theme swapping)
 */
var settingsCtrl = require('../controllers/settings.controller');

module.exports = function(app) {
    app.get('/theme/change', settingsCtrl.changeTheme);
};
