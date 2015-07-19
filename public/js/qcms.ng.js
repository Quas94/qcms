var qcms = angular.module('qcms', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap'
]);

qcms.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: '/view/home'
                // controller: 'qcmsCtrl'
            }).
            when('/blog/:id', {
                templateUrl: function(urlAttr) {
                    return '/view/blog/' + urlAttr.id;
                },
                controller: 'blogPostCtrl'
            }).
            when('/blog', {
                templateUrl: '/view/blog',
                controller: 'blogCtrl'
            }).
            when('/about', {
                templateUrl: '/view/about'
                // controller: 'qcmsCtrl'
            }).
            when('/contact', {
                templateUrl: '/view/contact'
                // controller: 'qcmsCtrl'
            }).
            otherwise({
                // redirectTo: '/404'
            });

        $locationProvider.html5Mode(true);
    }]);

qcms.controller('mainCtrl', ['$scope', '$http', '$rootScope', '$timeout', '$location',
    function($scope, $http, $rootScope, $timeout, $location) {
        $scope.rowCollapsed = true;
        // callback for location change events
        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            $scope.rowCollapsed = true;
            console.log('Starting to change (from: ' + oldUrl + ', to: ' + newUrl);
        });
        $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
            console.log('Change successful!');
            $timeout(function() {
                $scope.rowCollapsed = false;
            }, 100);
        });

        $scope.active = function(page) {
            var path = $location.path().replace('/', '');
            var string = '^' + page + '.*$';
            var regex = new RegExp(string, 'i');
            // console.log('regex string is ' + string + ', page = ' + page + ', matches = ' + regex.test(page));
            return regex.test(path) ? 'active' : '';
        }

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
        }
    }]);

qcms.controller('blogCtrl', ['$scope', '$http', '$location',

    function($scope, $http, $location) {
        $scope.formData = {};

        // upon landing on the page, get all posts and show
        $http.get('/post')
            .success(function(data) {
                // sort posts in order of post date, newest first
                data.sort(function(a, b) {
                    return new Date(b.date) - new Date(a.date);
                });

                // for all posts, convert Date object into formatted string for display on page
                for (var i in data) {
                    data[i].date = formatDate(data[i].date);
                }

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

qcms.controller('blogPostCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        var path = $location.path();
        path = path.replace('/blog', '');
        path = '/post' + path;

        // upon page load, fetch info for this blog post
        $http.get(path)
            .success(function(data) {
                if (data.length !== 1) {
                    console.log('Error: tried to load a single post, but json array length was ' + data.length);
                }
                var post = data[0];
                post.date = formatDate(post.date);
                $scope.post = post;
            })
            .error(function (error) {
                console.log('blogPostCtrl error on fetching post: ' + error);
            });
    }]);
