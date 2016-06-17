app.service('ServerService', function ($http) {
    function httpError(data, status, headers, config) {
        alert('server error ' + status);
        w = window.open();      // 개발이 완료되면 이 줄은 주석으로 막아야 함.
        w.document.write(data); // 개발이 완료되면 이 줄은 주석으로 막아야 함.
    }

    var SERVER_URL = 'http://localhost:80/appServer2';

    function httpGet(url, params, callback) {
        $http({ method: 'get', url: SERVER_URL + url, params: params })
          .success(function (data, status, headers, config) { callback(data); })
          .error(httpError);
    }

    function httpPost(url, params, callback) {
        $http({ method: 'post', url: SERVER_URL + url, params: params })
          .success(function (data, status, headers, config) { callback(data); })
          .error(httpError);
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
});
