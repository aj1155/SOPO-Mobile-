var app = angular.module('myApp', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures']);


app.run(function($transform) {
    window.$transform = $transform;
});

app.config(function($routeProvider) {
    $routeProvider.when('/',      { templateUrl : 'home.html', reloadOnSearch : false ,controller:'LoginCtrl'});
    $routeProvider.when('/log',{templateUrl:'log.html',reloadOnSearch : false,controller:'LoginCtrl'});
    $routeProvider.when('/user',  { templateUrl : 'user.html', reloadOnSearch : false,controller:'LoginCtrl' });
        $routeProvider.when('/regist',  { templateUrl : 'regist.html', reloadOnSearch : false,controller:'RegistCtrl' });
        $routeProvider.when('/userList',  { templateUrl : 'userList.html', reloadOnSearch : false,controller:'userList' });
          $routeProvider.when('/userList2',  { templateUrl : 'userList2.html', reloadOnSearch : false,controller:'userList' });
            $routeProvider.when('/userInfo/:user',  { templateUrl : 'userInfo.html', reloadOnSearch : false,controller:'infoController'});
            $routeProvider.when('/subject',  { templateUrl : 'subject.html', reloadOnSearch : false,controller:'subController'});
            $routeProvider.when('/message/:id',  { templateUrl : 'message.html', reloadOnSearch : false,controller:'ChatController'});
            $routeProvider.when('/notice/:student/:room_id',  { templateUrl : 'notice.html', reloadOnSearch : false,controller:'NoticeController'});
            $routeProvider.when('/NoUser/:member',  { templateUrl : 'NoUser.html', reloadOnSearch : false,controller:'NoUserController'});
              $routeProvider.when('/makeNotice/:student',  { templateUrl : 'makeNotice.html', reloadOnSearch : false,controller:'NoticeRoomController'});
              $routeProvider.when('/userList3',  { templateUrl : 'userList3.html', reloadOnSearch : false,controller:'userList'});
              $routeProvider.when('/photo',  { templateUrl : 'photo.html', reloadOnSearch : false, controller: 'PhotoController' })

});

app.controller('MainController', function($rootScope, $scope,$http,$location) {


  $rootScope.SERVER_URL = 'http://192.168.0.20:3000/api/';
  $scope.login=null;
  $scope.userName=null;
  $scope.user={};
  $scope.savePassword = false;




  $scope.logout = function(){
    $http({
        method: 'get',
        url: $rootScope.SERVER_URL+'logout',

    }).success(function (data, status, headers, config) {
      location.href = '#/';

    }).error(function(data){
          console.log('Error:'+data);
    });
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

app.controller('infoController', function($http,$scope,$routeParams,$location,$rootScope){
  $scope.user = JSON.parse($routeParams.user);  // 학생정보 및 메세지 수신자
  console.log($routeParams.user);
  console.log($scope.user);

  $scope.goMessage = function(id)
  {

    $http({
        method: 'post',
        url: $rootScope.SERVER_URL+'getText',
        params: { sender: $rootScope.user.id, receiver: $scope.user.user_id}
    }).success(function (data, status, headers, config) {
        if (data) {
          console.log('레이첼맥아덤즈');
            $rootScope.ptext = data[0];
            $rootScope.ptext2 = data[1];
            console.log($rootScope.ptext);
            console.log($rootScope.ptext2);
            $location.path("/message/" + id);
        } else {

        }
    }).error(function(data){
          console.log('Error:'+data);
    });


  };


});
app.controller('subController', function($scope, $rootScope, $http){


  $scope.data = [];
  $http.get('/api/getSub')
  .success(function(data){

    if(data)
    {
      console.log('data로드 성공');
      $rootScope.subject = data;
    }
    else{
      console.log("실패");
    }


  })
  .error(function(data){

    console.log('Error:'+data);
  });

  $scope.sync = function(bool, item){
    console.log('aa');
   if(bool){
     // add item
     $scope.data.push(item);
   } else {
     // remove item
     for(var i=0 ; i < $scope.data.length; i++) {
       if($scope.data[i].subject_id == item.subject_id){
         $scope.data.splice(i,1);
       }
     }
   }
 };

  $scope.isChecked = function(id){
    console.log('bb');
     var match = false;
     for(var i=0 ; i < $rootScope.subject.length; i++) {
       if($rootScope.subject[i].subject_id == id){
         match = true;
       }
     }
     return match;
 };

  $scope.regSub = function()
  {
    console.log($scope.data);
    $http({
        method: 'get',
        url:$rootScope.SERVER_URL+'regSub',
        params: { data: JSON.stringify($scope.data),user:JSON.stringify($rootScope.user.id)}
    }).success(function(data){

      if(data)
      {
        console.log('data로드 성공');
        location.href="#/user";
      }
      else{
        console.log("실패");
      }


    })
    .error(function(data){

      console.log('Error:'+data);
    });

  };
});

app.controller('NoticeController', function($scope, Socket, $routeParams,$http,$rootScope,$location,$compile,$window){
  $scope.student = JSON.parse($routeParams.student);
  var room_id = $routeParams.room_id;
  console.log($scope.student);
  console.log('방번호:');
  console.log(room_id);

  $scope.roomName="";
  $scope.messages = [];
  $scope.msg;
  $scope.rec_name="";
  $scope.rec_id="";
  console.log($scope.student);

  for(var i=0;i<$scope.student.length;i++)
  {

    $scope.rec_name += $scope.student[i].name;
    if(i<$scope.student.length-1)
    {
      $scope.rec_name +='/';
    }
  }


  for(var j=0;j<$scope.student.length;j++)
  {
    $scope.rec_id += $scope.student[j].user_id;
    if(j<$scope.student.length-1)
    {
      $scope.rec_id +='/';
    }
  }


  console.log($scope.rec_name);
  console.log($scope.rec_id);


  $scope.getRoomMessage = function(){
    console.log('메고1');
    $http({
        method: 'get',
        url: $rootScope.SERVER_URL+'getRoomMessage',
        params: {id:room_id}
    }).success(function (data, status, headers, config) {
        if (data) {

          $scope.roomMessage = data;
          console.log($scope.roomMessage);

        } else {

        }
    }).error(function(data){
          console.log('Error:'+data);
    });
  };
  Socket.on('chatMessage',function(message){
    $scope.messages.push(message);
  });
  $scope.setNickName = function()
  {
      console.log($scope.$parent.user);
      Socket.setNickName('setNickName',$scope.$parent.user.id);
  };
  $scope.sendMessage = function(){
    console.log(room_id);
    Socket.sendMsg('room',room_id);
    Socket.sendMsg('chatMessage2',$scope.msg,$scope.$parent.user.name,JSON.stringify($scope.student));
    $scope.msg = '';
};
$scope.$on('$destroy', function() {
    Socket.removeListener('chatMessage');
  })
  $scope.openWindow = function(id) {
    $http({
        method: 'get',
        url: $rootScope.SERVER_URL+'getNoreadUser',
        params: {msg_id:id}
    }).success(function (data, status, headers, config) {
        if (data) {


            $window.open('/NoUser'+JSON.stringify(data), 'C-Sharpcorner', 'width=500,height=400');
            $location.path("/NoUser/"+JSON.stringify(data));
        } else {

        }
    }).error(function(data){
          console.log('Error:'+data);
    })




      };
});
app.controller('NoUserController', function($scope, Socket, $routeParams,$http,$rootScope,$location){

  $scope.members = JSON.parse($routeParams.member);
  console.log($scope.members);


});
app.controller('NoticeRoomController', function($scope, Socket, $routeParams,$http,$rootScope,$location){
  $scope.student = JSON.parse($routeParams.student);


  $scope.roomName="";
  $scope.messages = [];
  $scope.msg;
  $scope.rec_name="";
  $scope.rec_id="";
  for(var i=0;i<$scope.student.length;i++)
  {

    $scope.rec_name += $scope.student[i].name;
    if(i<$scope.student.length-1)
    {
      $scope.rec_name +='/';
    }
  }


  for(var j=0;j<$scope.student.length;j++)
  {
    $scope.rec_id += $scope.student[j].user_id;
    if(j<$scope.student.length-1)
    {
      $scope.rec_id +='/';
    }
  }


  $scope.noticeInfo = function(student)
  {
    $http({
        method: 'post',
        url: $rootScope.SERVER_URL+'makeNotice',
        params: { professor: JSON.stringify($rootScope.user), student:$scope.rec_name,student_id:$scope.rec_id,roomName:$scope.roomName}
    }).success(function (data, status, headers, config) {
        if (data) {
            console.log('김만기1234');
            $location.path("/notice/"+JSON.stringify(student)+"/"+data);
        } else {

        }
    }).error(function(data){
          console.log('Error:'+data);
    });

  };



});
app.controller('ChatController', function($scope, Socket, $routeParams){
  var id = $routeParams.id;
  $scope.messages = [];
  $scope.msg;

  Socket.on('chatMessage',function(message){
    $scope.messages.push(message);
  });
  $scope.setNickName = function()
  {
      console.log($scope.$parent.user);
      Socket.setNickName('setNickName',$scope.$parent.user.id);
  };
  $scope.sendMessage = function(){

    Socket.sendMsg('chatMessage',$scope.msg,$scope.$parent.user.name,id);
    $scope.msg = '';
};
$scope.$on('$destroy', function() {
    Socket.removeListener('chatMessage');
  })

});

app.controller('PhotoController', function($scope,ServerService, PhotoService) {
    function onSuccess(imageURL) {
        var userId = 1;
        ServerService.imageUpload(userId, imageURL, function(result) {
            if (result.success) {
                var imageId = result.message;
                var url = ServerService.imageDownloadUrl(imageId);
                alert(url);
                $("#image").attr("src", url);
            } else
                alert(result.message);
        });
    }

    $scope.fromCamera = function() {
        PhotoService.fromCamera(onSuccess);
    }

    $scope.fromAlbum = function() {
        PhotoService.fromAlbum(onSuccess);
    }
});



app.controller('RegistCtrl',  function($scope,$http,$timeout){


    $scope.registMessage;
      $scope.userInfo={
        special : 0
      };
      $scope.user={};


          $scope.doRegist = function(){
            console.log("post고고");

            $http.post($rootScope.SERVER_URLL+'regist_User',$scope.userInfo)
            .success(function(data){
              console.log(data);
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

app.controller('LoginCtrl', function($rootScope,$scope,$http,$location) {
  $scope.formData={};
  $scope.len = {};
  var len;
  $scope.subjects;
  $scope.rooms={};
  $scope.stu = [];

  $scope.deleteRoom = function(id){
    for(var s=0;s<$scope.rooms.length;s++)
    {
      if($scope.rooms[s].room_id == id)
      {
        $scope.rooms.splice(s,1);
      }
    }
    $http({
        method: 'get',
        url: $rootScope.SERVER_URL+'deleteRoom',
        params: {roomId : id}
    }).success(function (data, status, headers, config) {
        if (data) {

        console.log('Room삭제 성공');


        } else {

        }
    }).error(function(data){
          console.log('Error:'+data);
    });

  };
  $scope.goNotice = function(room){
    console.log(room);
    $http({
        method: 'get',
        url: $rootScope.SERVER_URL+'getRoom2',
        params: { roomid:room.room_id,roomName:room.room_name,id:$rootScope.user.id,name:$rootScope.user.name}
    }).success(function (data2, status, headers, config) {
        if (data2) {
          $http({
              method: 'get',
              url: $rootScope.SERVER_URL+'userList',

          }).success(function (data, status, headers, config) {
              if (data) {

                $scope.len = data;
                console.log($scope.len);
                console.log(data2);
                console.log(data2[0]);


                var temp = data2[0].student.split('/');

                for(var i =0;i<temp.length;i++)
                {


                  for(var j=0;j<$scope.len.length;j++)
                  {

                    if(temp[i] == $scope.len[j].name)
                    {


                        $scope.stu.push($scope.len[j]);
                    }
                  }
                }
                console.log($scope.stu);
                $location.path("/notice/"+JSON.stringify($scope.stu)+"/"+room.room_id);

              } else {

              }
          }).error(function(data){
                console.log('Error:'+data);
          });




        } else {

        }
    }).error(function(data){
          console.log('Error:'+data);
    });
  }
  $scope.getStudentRoom = function(){
    $http({
        method: 'get',
        url: $rootScope.SERVER_URL+'getStudentRoom',
        params: { user:JSON.stringify($rootScope.user)}
    }).success(function (data, status, headers, config) {
        if (data) {

          $scope.subjects = data;

          $http({
              method: 'get',
              url: $rootScope.SERVER_URL+'getRoomCount',
              params: { name:$rootScope.user.name}
          }).success(function (data, status, headers, config) {
              if (data) {
                console.log($scope.subjects);
                console.log(data);
                for(var i=0;i<data.length;i++)
                {
                  console.log('진입');
                  for(var j=0;j<$scope.subjects.length;j++)
                  {
                    console.log('진입');
                    if(data[i].room == $scope.subjects[j].room_id)
                    {
                      console.log('진입');
                      $scope.subjects[j].count +=1;
                      console.log($scope.subjects[j].count );
                    }
                  }
                }


              } else {

              }
          }).error(function(data){
                console.log('Error:'+data);
          });

        } else {

        }
    }).error(function(data){
          console.log('Error:'+data);
    });

  };
  $scope.getRoom = function(){
    $http({
        method: 'get',
        url: $rootScope.SERVER_URL+'getRoom',
        params: { professor:$rootScope.user.name}
    }).success(function (data, status, headers, config) {
        if (data) {

          $scope.rooms = data;


        } else {

        }
    }).error(function(data){
          console.log('Error:'+data);
    });
  };
  $scope.join = function(){
    location.href='#/regist';
  };
  $scope.getMessage = function() {
    console.log('일단 포스트 들어옴');
    $http.post($rootScope.SERVER_URL+'getMessage',$scope.$parent.user)
    .success(function(data){

      if(data)
      {
        console.log('data로드 성공');
        $rootScope.getmessage = data;
      }
      else{
        console.log("실패");
      }


    })
    .error(function(data){

      console.log('Error:'+data);
    });
  };

  $scope.getSend = function() {
    console.log('일단 포스트 들어옴');
    $http.post($rootScope.SERVER_URL+'getSend',$scope.$parent.user)
    .success(function(data){

      if(data)
      {
        console.log('data로드 성공');
        $rootScope.sendmessage= data;
      }
      else{
        console.log("실패");
      }


    })
    .error(function(data){

      console.log('Error:'+data);
    });
  };





      $scope.doLogin = function(){
        console.log("post고고");


        $http.post($rootScope.SERVER_URL+'login_user',$scope.formData)
        .success(function(data){

          if(data.id == $scope.formData.id)
          {

            $rootScope.user = data;
            $scope.$parent.user = data;



            $scope.$parent.login = data.id;
            $scope.$parent.userName = data.name;
              location.href="#/user";
              console.log('성공');
              console.log(data);
          }
          else{
            $scope.loginMessage = "로그인 실패";
          }


        })
        .error(function(data){
          $scope.loginMessage = "로그인 실패";
          console.log('Error:'+data);
        });
      };




    });

    app.controller('userList', function($scope,$http,$location,$rootScope,DepartmentService) {

      $scope.users={};
      $scope.checkall = true;
      $scope.check = false;
      $scope.subUser = [];
      $rootScope.departmentList = [];
      $rootScope.deList = [];
      $scope.student=[];

      $scope.checkAllValue = function(value){

            if(value)
            {
              for(var i=0;i<$rootScope.userList.length;i++)
              {
                var index= $scope.student.indexOf($rootScope.userList[i]);
                if(index <0)
                {
                  $scope.student.push($rootScope.userList[i]);
                }
              }
              $scope.checkall = false;
            }
            else
            {
                $scope.student.splice(0,$scope.student.length);
                $scope.checkall = true;
            }


          console.log($scope.student);
      };
     $scope.checkValue = function(user)
     {
       var index= $scope.student.indexOf(user);
       if(index> -1)
       {
         $scope.student.splice(index,1);
       }
       else{
         $scope.student.push(user);
       }

       console.log($scope.student);
     };

      $scope.loadDepartmentList = function() {
          DepartmentService.getDepartmentList(function(data) {
              $rootScope.departmentList = data;

              console.log($rootScope.departmentList[0]);
              console.log($rootScope.departmentList[2]);
          });
      };
      $scope.loadDepartmentUserList = function(index) {


          if (!$rootScope.deList[index]){
          DepartmentService.getDepartmentUserList(index+1, function(data) {
                console.log(data);
                console.log("data바인딩");
                  $rootScope.deList[index]= data;
              });

          }
      };

          $scope.userInfo = function(user)
          {

                $location.path("/userInfo/"+JSON.stringify(user));



          };
          $scope.noticeInfo = function(student)
          {
              console.log(student);
              console.log($scope.student);
              $location.path("/makeNotice/"+JSON.stringify(student));
          }



          $scope.getAll = function(){
            console.log("post2고고");
            $http.get($rootScope.SERVER_URL+'userList')
            .success(function(data){

              if(data)
              {
                console.log('data로드 성공');
                $rootScope.userList = data;
              }
              else{
                console.log("실패");
              }


            })
            .error(function(data){

              console.log('Error:'+data);
            });
          };

          $scope.gotoTab = function(index) {
              $scope.activeTab1 = index;
              console.log('index값'+index);
              $scope.loadDepartmentUserList(index);
          };

        $scope.loadDepartmentList();
        $scope.gotoTab(0);




        });
