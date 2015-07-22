var create = angular.module('create', [
        'ngSanitize'
    ]);

create.controller('createCtrl', ['$scope', '$http', '$window',

    function($scope, $http, $window) {
        $scope.formData = {};
        $scope.message = '';

        // upon landing on the page, get all posts and show
        $http.get('/post')
            .success(function(data) {
                // show posts
                $scope.posts = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
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
            var title = $scope.formData.title;
            var body = $scope.formData.body;
            if (title != null && title.length > 0 && body != null && body.length > 0) {
                $http.post('/post', $scope.formData)
                    .success(function(data) {
                        $scope.formData = {}; // clear form to prep for next entry
                        $scope.posts = data;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
            }
            // otherwise do nothing, not long enough
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
        }

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

        // login
        $scope.login = function() {
            $http.post('/login', {
                username: $scope.formData.username,
                password: $scope.formData.password
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
