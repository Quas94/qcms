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
        $scope.navbarActive = {};
        // callback for location change events
        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            $scope.rowCollapsed = true;
            console.log('Starting to change (from: ' + oldUrl + ', to: ' + newUrl);
            updatePage($scope, $location.path());
        });
        $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
            console.log('Change successful!');
            $timeout(function() {
                $scope.rowCollapsed = false;
            }, 100);
        });
    }]);

qcms.controller('blogCtrl', ['$scope', '$http', '$location',

    function($scope, $http, $location) {
        $scope.formData = {};

        // upon landing on the page, get all posts and show
        $http.get('/post')
            .success(function(data) {
                // set correct navbar element to active
                updatePage($scope, $location.path());

                // sort posts in order of post date, newest first
                data.sort(function(a, b) {
                    return new Date(b.date) - new Date(a.date);
                });

                // for all posts, convert Date object into formatted string for display on page
                for (var i in data) {
                    var date = new Date(data[i].date);
                    var hours = date.getHours();
                    var mins = date.getMinutes();
                    if (mins < 10) mins = '0' + mins;
                    var meridian = 'AM';
                    if (hours >= 12) meridian = 'PM';
                    if (hours > 12) hours -= 12;
                    var display = date.toLocaleDateString() + ', ' + hours + ':' + mins + ' ' + meridian;
                    data[i].date = display;
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

function updatePage($scope, path) {
    var path = path.replace('/', '');
    // debug log path
    console.log('Path is: ' + path);
    for (var key in $scope.navbarActive) {
        $scope.navbarActive[key] = '';
    }
    $scope.navbarActive[path] = 'active';
}
