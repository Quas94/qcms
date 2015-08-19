/**
 * Mongoose model representing content of additional pages other than blog (about, projects, contact)
 *
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');

var PagesModel = mongoose.model('AdditionalPages', {
    page: String, // lowercase page name eg. 'about', 'projects'
    title: String, // displayed as page heading, eg. 'About Me', 'Projects'
    content: String
});

exports.model = PagesModel;
