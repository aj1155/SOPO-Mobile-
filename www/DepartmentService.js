var SERVER_URL ='http://192.168.0.20:3000/api/';
app.service('DepartmentService', function ($http) {
    this.getDepartmentList = function(callback) {
        $http({
            method: 'get',
            url: SERVER_URL+'getSub'
        }).success(function (data, status, headers, config) {
            callback(data);
        }).error(function(data){

          console.log('Error:'+data);
        });
    };

    this.getDepartmentUserList = function(id, callback) {
        $http({
            method: 'get',
            url: SERVER_URL+'getSubUser',
            params: { did: id }
        }).success(function (data, status, headers, config) {
            callback(data);
        }).error(function(err){
          console.log(err);
        });
    };
});
