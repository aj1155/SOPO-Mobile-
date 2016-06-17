app.service('ServerService', function ($http) {
    function httpError(data, status, headers, config) {
        alert('server error ' + status);
        w = window.open();      // 개발이 완료되면 이 줄은 주석으로 막아야 함.
        w.document.write(data); // 개발이 완료되면 이 줄은 주석으로 막아야 함.
    }

    var SERVER_URL = 'http://192.168.0.20:3000/api/';
    //var SERVER_URL = 'http://localhost:8080/appServer1';

    function httpGet(url, params, callback) {
        $http({ method: 'get', url: SERVER_URL + url, params: params })
          .success(function (data, status, headers, config) { callback(data); })
          .error(httpError);
    }

    function httpPost(url, params, callback) {
        $http({ method: 'post', url: SERVER_URL, params: params })
          .success(function (data, status, headers, config) { callback(data); })
          .error(httpError);
    }

    function fileUpload(url, params, fileKey, fileUrl, callback) {
        function uploadError(error) {
            alert("ErrCode:"+error.code+" ErrSource:"+error.source+" ErrTarget:"+error.target);
        }
        function uploadSuccess(data) {
            callback(JSON.parse(data.response));
        }

        var options = new FileUploadOptions();
        options.fileKey = fileKey;
        options.fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params = params;
        var fileTransfer = new FileTransfer();
        fileTransfer.upload(fileUrl, encodeURI('http://172.30.36.32:3000/api/upload'), uploadSuccess, uploadError, options);
    }

    this.articleList = function(count, callback) {
        httpGet('/articleList.do', {count: count}, callback);
    }

    this.article = function(id, callback) {
        httpGet('/article.do', {id: id}, callback);
    }

    this.articleSave = function(article, callback) {
        httpPost('/articleSave.do', article, callback);
    }

    this.articleDelete = function(id, userId, callback) {
        httpGet('/articleDelete.do', {id: id, userId: userId}, callback);
    }

    this.login = function(loginId, passwd, callback) {
        httpPost('/login.do', {loginId: loginId, passwd: passwd}, callback);
    }

    this.imageUpload = function(user, imageFileUrl, callback) {
        fileUpload('/imageUpload.do', {userId: user}, "file", imageFileUrl, callback);
    };

    this.imageDownloadUrl = function(imageId) {
        return SERVER_URL + '/imageDownload.do?id=' + imageId;
    }
});
