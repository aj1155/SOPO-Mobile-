var loginModule = angular.module('myApp',['ngCookies']);

loginModule.controller('loginController',function($scope,$http,$cookieStore){

$scope.formData = {};

  $scope.goJoin = function(){
    location.href = "Join.html";
  });



  $scope.doLogin = function(){
    console.log("post고고");
    $http.post('/api/login_user',$scope.formData)
    .success(function(data){
      $scope.users = data;
      if(scope.users.length==0){
        $scope.error = "<<<로그인 실패>>>";
        //document.getElementById("message").innerHtml = "<div class='alert alert-danger' role='alert' >로그인 실패</div>"
      }
      else if($scope.users[0].id!=null){
        $cookieStore.put('user',$scope.users);
        if($scope.users[0].type =='0')
        {
          location.href="UserList.html";
        }
        else {
          location.href="User.html";
        }
      }
    })
    .error(function(data){
      console.log('Error:'+data);
    });
  };
});
