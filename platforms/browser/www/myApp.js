var app = angular.module('myApp', [ 'ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures' ]);

app.run(function($transform) {
    window.$transform = $transform;
});

app.config(function($routeProvider) {
    $routeProvider
      .when('/',       { templateUrl : 'home.html', reloadOnSearch : false })
      .when('/articleList',  { reloadOnSearch : false,
                         templateUrl : 'articleList.html', controller: 'ArticleListController' })
      .when('/article/:index',  { reloadOnSearch : false,
                         templateUrl : 'article.html', controller: 'ArticleController' })
      .when('/articleCreate', { reloadOnSearch : false,
                         templateUrl : 'articleEdit.html', controller: 'ArticleCreateController' })
      .when('/login',  { reloadOnSearch : false,
                         templateUrl : 'login.html', controller: 'LoginController' })
     .when('/articleEdit/:index', { reloadOnSearch : false,
                         templateUrl : 'articleEdit.html', controller: 'ArticleEditController' })

});

app.controller('MainController', function($rootScope, $scope, $location, $sce, ServerService) {
    $scope.articleList = [];

    $scope.loadArticleList = function(count) {
        ServerService.articleList($scope.articleList.length + count, function(data) {
            $scope.articleList = data;
        });
    }
    $scope.loadArticle = function(index) {
        if (!$scope.articleList[index].body)
            ServerService.article($scope.articleList[index].id, function(data) {
                data.body = $sce.trustAsHtml(data.body);
                $scope.articleList[index] = data;
            });
    }
    $scope.logout = function() {
        $rootScope.user = null;
        $location.path("/");
    }

    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.loading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.loading = false;
    });
});


app.controller('ArticleListController', function($rootScope, $scope, $location, ServerService) {
    function saveScrollPosition() { $rootScope.list1_scrollTop = $("div#list1").scrollTop(); };
    function restoreScrollPosition() { $("div#list1").scrollTop($rootScope.list1_scrollTop); }

    $scope.gotoArticle = function(index) {
        saveScrollPosition();
        $location.path("/article/" + index);
    }

    if ($scope.articleList.length == 0) $scope.loadArticleList(10);
    if ($scope.list1_scrollTop) { setTimeout(restoreScrollPosition, 300); }
});
app.controller('ArticleEditController', function($rootScope, $scope, $location, $routeParams,
                                                                            ServerService) {
    var index = $routeParams.index;
    $scope.title = $scope.articleList[index].title;
    $scope.body = $scope.articleList[index].body;

    $scope.save = function() {
        var article = { id: $scope.articleList[index].id, userId: $scope.user.id,
                              title: $scope.title, body: $scope.body };
        ServerService.articleSave(article, function(result) {
            if (result.success) {
                delete $scope.articleList[index].body;
                $scope.loadArticle(index);
                $location.path("/article/" + index);
            } else
                alert(result.message);
        });
    }
});



app.controller('ArticleController', function($rootScope, $scope, $location, $routeParams,
                                                                            ServerService) {
    var index = $routeParams.index;
    $scope.index = index;
    $scope.loadArticle(index);

    $scope.delete = function() {
       ServerService.articleDelete($scope.articleList[index].id, $rootScope.user.id, function(result) {
            if (result.success) {
                $scope.loadArticleList(0);
                $location.path("/articleList");
            } else
                alert(result.message);
       });
    }
    $scope.gotoEdit = function() {
        $location.path("/articleEdit/" + index);
    }
});

app.controller('ArticleCreateController', function($scope, $location, ServerService) {
    $scope.save = function() {
        var article = { id:0, boardId:2, userId: $scope.user.id,
                              title: $scope.title, body: $scope.body };
        ServerService.articleSave(article, function(result) {
            if (result.success) {
                $scope.loadArticleList(0);
                $location.path("/articleList");
            } else
                alert(result.message);
        });
    }
});

app.controller('LoginController', function($rootScope, $scope, $location, ServerService) {
    $scope.login = function() {
        ServerService.login($scope.loginId, $scope.passwd, function(data) {
            if (data) {
                $rootScope.user = data;
                $location.path("/");
            } else {
                $rootScope.user = null;
                alert("로그인이 실패하였습니다.");
            }
        });
    }
});
