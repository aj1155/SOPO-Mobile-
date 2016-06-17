
app.service('Socket', function ($location, $timeout) {
    this.socket = io();


    this.on = function(eventName, callback) {
      if (this.socket) {
          this.socket.on(eventName, function(data) {
          $timeout(function() {
            callback(data);
          });
        });
      }
    };
    this.setNickName = function(eventName,nickName) {
      console.log(nickName);
      if (this.socket) {
          
        console.log(this.socket);
        this.socket.emit(eventName,nickName);
      }
    };
    this.sendMsg = function(eventName, data,sender,receiver) {
      if (this.socket) {
        console.log(sender+'전송'+data);
        console.log(this.socket);
        this.socket.emit(eventName, data,sender,receiver);
      }
    };
    this.removeListener = function(eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };

});
