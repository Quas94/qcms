/**
 * Controller for views. Renders requested view
 */

exports.home = function(req, res) {
    res.render('home');
};

exports.blogSpecific = function(req, res) {
    console.log('reached blog specific: ' + req.params.id);
    res.render('blogpost');
};

exports.blog = function(req, res) {
    res.render('blog');
};

exports.about = function(req, res) {
    res.render('about');
};

exports.contact = function(req, res) {
    res.render('contact');
};
