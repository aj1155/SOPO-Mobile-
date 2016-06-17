app.service('PhotoService', function () {
    function onError(message) { alert('Error: ' + message); }

    this.fromCamera = function(callback) {
        var options = {
            destinationType: navigator.camera.DestinationType.FILE_URI,
            quality: 50,
            correctOrientation: true,
            sourceType: navigator.camera.PictureSourceType.CAMERA
        }
        navigator.camera.getPicture(callback, onError, options);  // imgURL반환
    }

    this.fromAlbum = function(callback) {
        var options = {
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
        }
        navigator.camera.getPicture(callback, onError, options);
    }
})
