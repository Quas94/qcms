var create = angular.module('create', []);

create.controller('createCtrl', ['$scope', '$http',

    function($scope, $http) {
        $scope.formData = {};

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
    }]);
