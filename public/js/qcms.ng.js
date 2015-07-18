var qcms = angular.module('qcms', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap'
]);

qcms.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: '/view/home',
                controller: 'qcmsCtrl'
            }).
            when('/about', {
                templateUrl: '/view/about',
                controller: 'qcmsCtrl'
            }).
            otherwise({
                // redirectTo: '/404'
            });

        $locationProvider.html5Mode(true);
    }]);

qcms.controller('qcmsCtrl', ['$scope', '$http', '$location', '$rootScope', '$timeout',

    function($scope, $http, $location, $rootScope, $timeout) {
        $scope.formData = {};
        $scope.navbarActive = {
            home: '',
            about: ''
        };
        $scope.rowCollapsed = true;

        // callback for location change events
        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            $scope.rowCollapsed = true;
            console.log('Starting to change (from: ' + oldUrl + ', to: ' + newUrl);
            updatePage($scope, $location.path());
        });
        $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
            console.log('Change successful!');
            // var localhost = 'http://localhost/';
            // newUrl = newUrl.replace(localhost, '');
            $timeout(function() {
                console.log("Timed out, row collapsed was: " + $scope.rowCollapsed);
                $scope.rowCollapsed = false;
            }, 100);
        });

        // upon landing on the page, get all posts and show
        $http.get('/post')
            .success(function(data) {
                // set correct navbar element to active
                updatePage($scope, $location.path());

                // show posts
                $scope.posts = data;
                // for all posts, convert Date object into formatted string for display on page
                for (var i in $scope.posts) {
                    var date = new Date($scope.posts[i].date);
                    var hours = date.getHours();
                    var mins = date.getMinutes();
                    if (mins < 10) mins = '0' + mins;
                    var meridian = 'AM';
                    if (hours >= 12) meridian = 'PM';
                    if (hours > 12) hours -= 12;
                    var display = date.toLocaleDateString() + ', ' + hours + ':' + mins + ' ' + meridian;
                    $scope.posts[i].date = display;
                }
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
    for (key in $scope.navbarActive) {
        $scope.navbarActive[key] = '';
    }
    $scope.navbarActive[path] = 'active';
}
