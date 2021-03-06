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

qcms.factory('title', function() {
    var titleService = {};
    titleService.titleBase = 'TITLE_BASE_THIS_SHOULD_NEVER_APPEAR';
    titleService.titleSet = false; // flag for communication between blogPostCtrl and mainCtrl controllers
    return titleService;
});

qcms.factory('titleDraft', function() {
    var titleDraft = function(draft) {
        if (draft) { // if draft, return admin draft text alert
            return '[draft post - admin mode]';
        }
        return ''; // empty otherwise
    };
    return titleDraft;
});

qcms.controller('mainCtrl', ['$scope', '$http', '$rootScope', '$interval', '$timeout', '$location', '$window', 'row', 'title',
    function($scope, $http, $rootScope, $interval, $timeout, $location, $window, row, title) {
        $scope.navbarCollapsed = true;
        $scope.rowCollapsed = row.isCollapsed;
        // save the base title text
        title.titleBase = $window.document.title.replace(' - Not Found', '');
        // console.log("base title is " + $scope.titleBase); // TODO why is titleBase undefined here?
        // callback for location change events
        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            // set title back to base, and titleSet flag to false
            $window.document.title = title.titleBase;
            title.titleSet = false;
            // set row collapsed flags for both this scope and globally to true
            row.isCollapsed = true;
            $scope.rowCollapsed = true;
            // check several times per second to see if row.isCollapsed has been set to true, and update scope if so
            var updateRow = $interval(function() {
                // console.log('Interval checking');
                if (!row.isCollapsed) {
                    $interval.cancel(updateRow);
                    $timeout(function() { // just loaded
                        if (!title.titleSet) { // check that title wasn't already set by the blogPostCtrl
                            // work out suffix - this code is for pages with multiple words
                            // the following code is irrelevant for blog post page, for which blogCtrl sets title
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
                            $window.document.title = title.titleBase + ' - ' + suffix; // set title with suffix
                        }
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


qcms.controller('blogCtrl', ['$scope', '$http', 'row', 'titleDraft',

    function($scope, $http, row, titleDraft) {
        $scope.newPostForm = {};

        $scope.processTags = processTags;

        // upon landing on the page, get all posts and show
        var page = 1;
        $http.get('/post/page/' + page)
            .success(function(data) {
                console.log('length = ' + data.length);
                // posts should arrive from the server already sorted from newest to oldest
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

        // if given draft = true, means we're logged in admin, this function returns text to display after title
        $scope.titleDraftText = titleDraft;
    }]);

qcms.controller('blogPostCtrl', ['$window', '$scope', '$http', '$location', 'row', 'title', 'titleDraft',
    function($window, $scope, $http, $location, row, title, titleDraft) {
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
                // set window title
                $window.document.title = title.titleBase + ' - ' + $scope.post.title;
                // set titleSet flag to true, so that mainCtrl doesn't override the line above
                title.titleSet = true;
                // console.log("Trying to set title to " + $scope.post.title);

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

        // title draft admin alert
        $scope.titleDraftText = titleDraft;
    }]);
