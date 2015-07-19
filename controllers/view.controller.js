/**
 * Controller for views. Renders requested view
 */

exports.home = function(req, res) {
    res.render('home');
};

exports.blogPost = function(req, res) {
    res.render('blog_post');
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
