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

        // delete post when checked
        $scope.deletePost = function(id) {
            $http.delete('/post/' + id)
                .success(function(data) {
                    $scope.posts = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
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
