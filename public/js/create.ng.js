var create = angular.module('create', [
        'ngAnimate',
        'ngSanitize',
        'ui.bootstrap'
    ]);

create.controller('createCtrl', ['$scope', '$http', '$window',

    function($scope, $http, $window) {
        $scope.newPostForm = {};
        $scope.newPageForm = {};
        $scope.loginForm = {};
        $scope.message = '';

        // upon landing on the page, get all posts and show
        $http.get('/post')
            .success(function(data) {
                // show posts
                $scope.posts = data;
                // set all comments to be collapsed to begin with
                for (var i = 0; i < $scope.posts.length; i++) {
                    $scope.posts[i].collapsed = true;
                }
            })
            .error(function(data) {
                console.log('Error in admincp getting all posts: ' + data);
            });
        // also get all pages and show
        $http.get('/pages')
            .success(function(data) {
                $scope.pages = data;
                console.log('pages: ' + JSON.stringify(data));
            })
            .error(function(err) {
                console.log('Error in admincp getting all pages: ' + err);
            });

        // format date function, identical to the one in qcms.ng.js
        $scope.formatDate = function(dateStr) {
            var date = new Date(dateStr);
            var hours = date.getHours();
            var mins = date.getMinutes();
            if (mins < 10) mins = '0' + mins;
            var meridian = 'AM';
            if (hours >= 12) meridian = 'PM';
            if (hours > 12) hours -= 12;
            var display = date.toLocaleDateString() + ', ' + hours + ':' + mins + ' ' + meridian;
            return display;
        };

        // submitting form, send post to node API
        $scope.createPost = function() {
            var title = $scope.newPostForm.title;
            var body = $scope.newPostForm.body;
            if (title != null && title.length > 0 && body != null && body.length > 0) {
                $http.post('/post', $scope.newPostForm)
                    .success(function(data) {
                        $scope.newPostForm = {}; // clear form to prep for next entry
                        $scope.posts = data;
                    })
                    .error(function(data) {
                        console.log('Error creating post: ' + data);
                    });
            }
            // otherwise do nothing, not long enough
        };
        // create page
        $scope.createPage = function() {
            var page = $scope.newPageForm.page;
            if (page != null && page.length > 0) {
                // only requirement for making a new page is the page-field is not blank
                $http.post('/pages', $scope.newPageForm)
                    .success(function(data) {
                        $scope.newPageForm = {}; // clear new page form
                        $scope.pages = data;
                    })
                    .error(function(err) {
                        console.log('Error creating page: ' + err);
                    });
            }
        };

        // edit post
        $scope.editPost = function(id) {
            var confirm = $window.confirm("Note that edited posts should have correct HTML, as the server will save as is. Confirm?");
            // if confirm, actually send request to server to edit post
            if (confirm) {
                // find correct index
                var index = -1;
                for (var i = 0; i < $scope.posts.length; i++) {
                    if ($scope.posts[i]._id === id) {
                        index = i;
                        break;
                    }
                }
                $http.post('/post/' + id, $scope.posts[index])
                    .success(function(data) {
                        $window.alert("Updated successful");
                    })
                    .error(function(err) {
                        console.log('Error occurred editing post: ' + err);
                    });
            }
        };
        // edit page
        $scope.editPage = function(id) {
            var index = -1;
            // find index of page we're editing
            for (var i = 0; i < $scope.pages.length; i++) {
                if ($scope.pages[i]._id === id) {
                    index = i;
                    break;
                }
            }
            $http.post('/pages/' + id, $scope.pages[index])
                .success(function(data) {
                    $window.alert("Updated page successfully");
                })
                .error(function(err) {
                    console.log('Error occurred editing page: ' + err);
                });
        };

        // delete post
        $scope.deletePost = function(id, title) {
            var confirm = $window.confirm("Deleting post titled '" + title + "', confirm?");
            // if 'ok' clicked, actually send request to server to delete post
            if (confirm) {
                $http.delete('/post/' + id)
                    .success(function(data) {
                        $scope.posts = data;
                    })
                    .error(function(err) {
                        console.log('Error occurred deleting post: ' + err);
                    });
            }
        };
        // delete page
        $scope.deletePage = function(id) {
            var confirm = $window.confirm("Deleting page, confirm?");
            // if 'ok' clicked, actually send request to server to delete post
            if (confirm) {
                $http.delete('/pages/' + id)
                    .success(function(data) {
                        $scope.pages = data;
                    })
                    .error(function(err) {
                        console.log('Error occurred deleting page: ' + err);
                    });
            }
        };

        // delete comment
        $scope.deleteComment = function(postId, commentId, author) {
            var confirm = $window.confirm("Deleting comment written by '" + author + "', confirm?");
            // fetch post index in $scope.posts array
            var postIndex = -1;
            for (var i = 0; i < $scope.posts.length; i++) {
                if ($scope.posts[i]._id === postId) {
                    postIndex = i;
                    break;
                }
            }
            if (confirm) {
                $http.delete('/post/' + postId + '/comment/' + commentId)
                    .success(function(data) {
                        $scope.posts[i] = data;
                    })
                    .error(function(err) {
                        console.log('Error encountered deleting comment: ' + err);
                    });
            }
        };

        // login
        $scope.login = function() {
            $http.post('/login', {
                username: $scope.loginForm.username,
                password: $scope.loginForm.password
            }).success(function(data) {
                if (data === 'Success') {
                    $window.location.href = '/admin';
                } else if ($scope.message != '') {
                    $scope.message += '!';
                } else {
                    $scope.message = data;
                }
            }).error(function(err) {
                console.log('Error trying to login: ' + err);
            });
        }
    }]);
