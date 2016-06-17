var app = angular.module('myApp', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures','ngFileUpload']);

app.run(function($transform) {
    window.$transform = $transform;
});

app.config(function($routeProvider) {
    $routeProvider.when('/',      { templateUrl : 'home.html', reloadOnSearch : false ,controller:'LoginCtrl'});
    $routeProvider.when('/test1', { templateUrl : 'test1.html', reloadOnSearch : false });
    $routeProvider.when('/test2', { templateUrl : 'test2.html', reloadOnSearch : false });
    $routeProvider.when('/tab1',  { templateUrl : 'tab1.html', reloadOnSearch : false });
    $routeProvider.when('/tab2',  { templateUrl : 'tab2.html', reloadOnSearch : false });
    $routeProvider.when('/accordion1',{ templateUrl : 'accordion1.html', reloadOnSearch : false });
    $routeProvider.when('/form1',{templateUrl:'form1.html',reloadOnSearch:false});
    $routeProvider.when('/log',{templateUrl:'log.html',reloadOnSearch : false,controller:'LoginCtrl'});
     $routeProvider.when('/dropDown',  { templateUrl : 'dropDown.html', reloadOnSearch : false });
      $routeProvider.when('/user',  { templateUrl : 'user.html', reloadOnSearch : false,controller:'LoginCtrl' });
        $routeProvider.when('/regist',  { templateUrl : 'regist.html', reloadOnSearch : false,controller:'RegistCtrl' });
          $routeProvider.when('/list',  { templateUrl : 'list.html', reloadOnSearch : false});
          $routeProvider.when('/article/:index',  { templateUrl : 'article.html', reloadOnSearch : false,controller: 'ArticleController'});

});

app.controller('MainController', function($rootScope, $scope) {

  $scope.articleList = [];
  $scope.message = "There is a way where you believe don't be afarid buddy you must get what u want";
  $scope.login=null;
  $scope.userName=null;
  $scope.activeTab = 1;
  $scope.activeAccordion = 1;
  $scope.ch1 = false;
  $scope.ch2 = false;
  $scope.ch3 = false;
  $scope.ch4 = false;
  $scope.activeBtn1 = 1;
    $scope.activeBtn2 = 1;
    $scope.activeBtn3 = 1;
    $scope.savePassword = false;



    $scope.loadData = function(count){
      for(var i=0;i<count;++i)
      {
        var article={
            title: "제목 #" + $scope.articleList.length,
            body: "내용 #" + $scope.articleList.length + " "+$scope.message
        };
        $scope.articleList.push(article);
      }
    }
    $scope.loadData(50);


    $scope.toggle = function(i){
      if(i==1)
      {
        i=0;
      }
      else{
        1;
      }
    }
    $scope.gotoTab = function(i){
      $scope.activeTab = i;
    };
    $scope.gotoAccordion= function(i){
      $scope.activeAccordion = i;
    }
    $scope.swiped = function(direction) {
        alert('Swiped ' + direction);
    };

$scope.onMenuClick = function(id){
  alert(id+"menu clicked!");
};
    // Needed for the loading screen
    // $rootScope : 부모의 멤버 변수를 사용 할때 가장 밖에 있는 컨트롤러 이경우는 부모가 없기 때문에 자기 자신과 같은 의미
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.loading = false;
    });



});
app.controller('up',  function($scope,$http,$timeout,$upload){
  $scope.images= [];

  $scope.processFiles = function(uploadImages){
      angular.forEach(uploadImages, function(flowFile, i){
          var fileReader = new FileReader();
              fileReader.onload = function(event){
                  var uri = event.target.result;
                      $scope.images[i] = uri;
              };
          fileReader.readAsDataURL(flowFile.file);
      });
  };
  $scope.imageUpload=function(){
      var sliceImage=$scope.images[0];
      var sliceImageArray=sliceImage.split(',');
      $http.post('/imageUpload',sliceImageArray[1]);

  };


});
app.controller('RegistCtrl',  function($scope,$http,$timeout){
    $scope.registMessage;
      $scope.userInfo={
        special : 0
      };
      $scope.user={};
      $scope.upload = function (files) {
             if (files && files.length) {
                 for (var i = 0; i < files.length; i++) {
                     var file = files[i];
                    Upload.upload({
                         url: '/api/upload2',
                         fields: {
                             'userInfo': $scope.userInfo
                         },
                         file: file
                     }).success(function (data, status, headers, config) {
                         console.log('file ' + config.file.name + 'uploaded. Response: ' +
                                     JSON.stringify(data));
                     });
                 }
             }
         };
          $scope.doRegist = function(){
            console.log("post고고");
            $http.post('/api/regist_User',$scope.userInfo)
            .success(function(data){
                if(data.result=="success")
                {
                    $scope.registMessage = "가입완료 되셨습니다. 로그인 해주세요";

                    var countUp = function() {
                      location.href='#/';

                  };

                    $timeout(countUp, 2000);

                }
                else{
                    $scope.registMessage = "가입실패";
                }

            })
            .error(function(data){
              $scope.loginMessage = "로그인 실패";
              console.log('Error:'+data);
            });
          };



        });

app.controller('LoginCtrl', function($scope,$http) {
  $scope.formData={};
  $scope.user={};

  $scope.join = function(){
    location.href='#/regist'
  }

      $scope.doLogin = function(){
        console.log("post고고");
        $http.post('/api/login_user',$scope.formData)
        .success(function(data){

          if(data.id == $scope.formData.id)
          {
            $scope.user = data;

            $scope.$parent.login = data.id;
            $scope.$parent.userName = data.name;
              location.href="#/user";
              console.log('성공');
              console.log(data);
          }
          else{
            $scope.loginMessage = "로그인 실패"
          }


        })
        .error(function(data){
          $scope.loginMessage = "로그인 실패";
          console.log('Error:'+data);
        });
      };




    });



app.controller('LoginController',function($scope){

  $scope.login = function(){
    if($scope.email !== $scope.password){
      $scope.loginMessage = "비밀번호 불일치";
    }else{
      $scope.loginMessage = "로그인 성공";
      location.href='#/'
    }
  };
});

app.controller('ArticleController', function($scope, $routeParams) {
    var index = $routeParams.index;
    $scope.article = $scope.articleList[index];
});
