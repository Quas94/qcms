/**
 * RESTful router for post fetching, editing, creation and deletion.
 */
var post = require('../controllers/post.controller');

module.exports = function(app) {
    app.get('/post/:postId', post.getSinglePost);
    app.post('/post/:postId/comment', post.createComment);
    app.get('/post', post.getPosts);
    app.post('/post', post.createPost);
    app.delete('/post/:postId', post.deletePost);
}

