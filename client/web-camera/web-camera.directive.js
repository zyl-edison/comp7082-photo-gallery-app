angular.module('webCameraApp')
  .directive('webCamera', [function() {
    return {
      restrict: 'E',
      templateUrl: 'web-camera/web-camera.template.html',
      scope:{
        onPhotoCaptured: "&",
      },
      controller: ['$scope', function($scope) {
        var self = this;
        var canvas = null;
        this.imageUrl = '';
        this.isStreaming = true;
        this.onCaptureButtonClick = function() {
          canvas = document.getElementById('canvas');
          var context = canvas.getContext('2d');
          context.drawImage($scope.video, 0, 0, canvas.width, canvas.height);
          self.isStreaming = false;
        };

        this.onAfterCaptureButtonClick = function(accepted) {
          if (accepted) {
            var data = canvas.toDataURL('image/png');
            $scope.onPhotoCaptured({data: data,});
            $scope.stream.getVideoTracks()[0].stop();
          } else {
            self.isStreaming = true;
          }
        };
      },],
      controllerAs: '$ctrl',
      link: function(scope) {
        scope.video = document.getElementById('video');
        navigator.mediaDevices.getUserMedia({
          video: true,
        }).then(function(stream) {
          scope.stream = stream;
          scope.video.srcObject = stream;
          scope.video.play();
        });
      },
    };
  },]);
