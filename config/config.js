/**
 * Configuration for qCMS
 */

/** Admin login details */
exports.adminUser = 'username';
exports.adminPass = 'PASSWORD';

/** Value of html <title> tag */
exports.headTitle = 'qCMS';

/** Big heading text */
exports.blogTitle = 'Welcome to qCMS!';
exports.blogDesc = 'a rookie content management platform written in an attempt to learn the JavaScript MEAN.io ' +
    'full-stack (MongoDB, Express, Angular and Node) as well as Bootstrap and a bit of jQuery.';

/** Number of blog posts displayed per page. This value affects both the admin and general viewers */
exports.postsPerPage = 10;

/** Contact information/links */
var NONE = '#'; // constant meaning no link for this social media
exports.contacts = {
    github: "http://www.github.com/",
    twitter: "http://www.twitter.com/",
    linkedin: "http://www.linkedin.com/",
    facebook: 'http://www.facebook.com/',
    youtube: 'http://www.youtube.com/',
    email: "address@domain.com"
};

exports.NONE = NONE;
