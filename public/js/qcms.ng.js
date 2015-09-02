var qcms = angular.module('qcms', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap'
]);

qcms.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
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
            when('/projects', {
                templateUrl: '/view/projects',
                controller: 'additionalPageCtrl'
            }).
            when('/about', {
                templateUrl: '/view/about',
                controller: 'additionalPageCtrl'
            }).
            when('/not-found', {
                templateUrl: '/view/not-found',
                controller: 'generalCtrl'
            }).
            otherwise({
                redirectTo: '/not-found'
            });

        $locationProvider.html5Mode(true);
    }]);

qcms.factory('row', function() {
    var rowService = {};
    rowService.isCollapsed = true; // initialises to collapsed
    return rowService;
});

qcms.controller('mainCtrl', ['$scope', '$http', '$rootScope', '$interval', '$timeout', '$location', '$window', 'row',
    function($scope, $http, $rootScope, $interval, $timeout, $location, $window, row) {
        $scope.navbarCollapsed = true;
        $scope.rowCollapsed = row.isCollapsed;
        // save the base title text
        $scope.titleBase = $window.document.title.replace(' - Not Found', '');
        console.log("base title is " + $scope.titleBase);
        // callback for location change events
        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            // set title back to base
            $window.document.title = $scope.titleBase;
            // set row collapsed flags for both this scope and globally to true
            row.isCollapsed = true;
            $scope.rowCollapsed = true;
            // check several times per second to see if row.isCollapsed has been set to true, and update scope if so
            var updateRow = $interval(function() {
                // console.log('Interval checking');
                if (!row.isCollapsed) {
                    $interval.cancel(updateRow);
                    $timeout(function() { // we have loaded
                        // work out suffix
                        var path = $location.path();
                        var lastIndex = path.lastIndexOf('/');
                        var line = path.substr(lastIndex + 1); // make line = everything after last slash
                        var words = line.split('-'); // split over dashes
                        var suffix = '';
                        for (var i = 0; i < words.length; i++) {
                            var firstUpper = words[i].substr(0, 1).toUpperCase();
                            var rest = words[i].substr(1);
                            var processedWord = firstUpper + rest; // capitalise first letter of each word
                            suffix += processedWord + ' '; // string onto suffix
                        }

                        // set title with suffix
                        $window.document.title = $scope.titleBase + ' - ' + suffix;
                        // de-collapse row
                        $scope.rowCollapsed = false;
                    }, 100);
                }
            }, 200);
        });
        $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
        });

        $scope.active = function(page) {
            var path = $location.path().replace('/', '');
            var string = '^' + page + '.*$';
            var regex = new RegExp(string, 'i');
            return regex.test(path) ? 'active' : '';
        };

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

        $scope.changeTheme = function() {
            // append $location.path() on end so the server knows where to redirect back to
            $window.location.href = '/theme/change' + $location.path();
        };
    }]);

qcms.controller('generalCtrl', ['row',
    function(row) {
        row.isCollapsed = false;
    }]);

var processTags = function(tags) {
    for (var i = 0; i < tags.length - 1; i++) {
        tags[i] += ', ';
    }
    return tags;
};

qcms.controller('additionalPageCtrl', ['$location', '$scope', '$http', 'row',
    function($location, $scope, $http, row) {
        var path = 'pages' + $location.path();

        // on page load, fetch content for this additional page
        $http.get(path)
            .success(function(data) {
                // console.log('content is ' + JSON.stringify(data));
                $scope.add = data;
                // uncollapse after data has loaded
                row.isCollapsed = false;
            })
            .error(function(err) {
                console.log('Error fetching additional page content: ' + err);
            });
    }]);


qcms.controller('blogCtrl', ['$scope', '$http', 'row',

    function($scope, $http, row) {
        $scope.newPostForm = {};

        $scope.processTags = processTags;

        // upon landing on the page, get all posts and show
        $http.get('/post')
            .success(function(data) {
                // sort posts in order of post date, newest first
                data.sort(function(a, b) {
                    return new Date(b.date) - new Date(a.date);
                });

                // show posts
                $scope.posts = data;
                // fix tags commas
                for (var i = 0; i < $scope.posts.length; i++) {
                    $scope.posts[i].tags = processTags($scope.posts[i].tags);
                }
                // set row service collapsed to false
                row.isCollapsed = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

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

        // trailing 's' on the end of 'comments'
        $scope.getTrailingS = function(post) {
            if (post.comments.length == 1) return '';
            return 's';
        };
    }]);

qcms.controller('blogPostCtrl', ['$scope', '$http', '$location', 'row',
    function($scope, $http, $location, row) {
        $scope.commentData = {};
        $scope.postCommentClicked = false;
        $scope.commentMessage = '';

        var path = $location.path();
        path = path.replace('/blog', '');
        path = '/post' + path;

        // upon page load, fetch info for this blog post
        $http.get(path)
            .success(function(data) {
                if (data.length !== 1) {
                    console.log('Error: tried to load a single post, but json array length was ' + data.length);
                }
                $scope.post = data[0];
                // fix tags formatting
                $scope.post.tags = processTags($scope.post.tags);

                // set row service collapsed to false
                row.isCollapsed = false;
            })
            .error(function (error) {
                console.log('blogPostCtrl error on fetching post: ' + error);
            });

        // posting comments
        $scope.postComment = function() {
            // disable button to prevent lag-induced repeated submissions
            $scope.postCommentClicked = true;
            $scope.commentMessage = '';
            // check input for validity
            var author = $scope.commentData.author;
            var comment = $scope.commentData.body;
            if (author != undefined && author.length > 0 && comment != undefined && comment.length > 0) {
                $http.post('/post/' + $scope.post._id + '/comment', {
                    author: $scope.commentData.author,
                    body: $scope.commentData.body
                }).success(function (data) {
                        $scope.commentData = {}; // clear comment form fields
                        $scope.postCommentClicked = false; // re-enable post comment button
                        $scope.post = data;
                }).error(function (error) {
                    console.log('Error posting comment: ' + error);
                });
            } else {
                // invalid input
                $scope.postCommentClicked = false;
                $scope.commentMessage = 'Invalid comment input. Please check your response and try again.';
            }
        }
    }]);
