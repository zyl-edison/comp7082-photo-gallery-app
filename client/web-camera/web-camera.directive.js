angular.module('webCameraApp')
  .directive('webCamera', [function() {
    return {
      restrict: 'E',
      templateUrl: 'web-camera/web-camera.template.html',
      scope:{
        onPhotoCaptured: "&",
      },
      controller: ['$scope', '$http', function($scope) {
        var self = this;
        var canvas = null;
        var recordingTimeMS = 5000;
        this.imageUrl = '';
        this.isStreaming = true;
        this.isRecording = false;

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

        function wait(delayInMS) {
          return new Promise(resolve => setTimeout(resolve, delayInMS));
        }

        this.onRecordButtonClick = function() {
          if (!self.isRecording) {
            self.isRecording = true;
            navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            }).then((stream) => {
              $scope.stream = stream;
              $scope.video.srcObject = stream;
              return new Promise((resolve) => {$scope.video.onplaying = resolve;});
            }).then(() => {
              var mediaStream = $scope.video.captureStream();
              var recorder = new MediaRecorder(mediaStream);
              var data = [];
              recorder.ondataavailable = (event) => {
                data.push(event.data);
              };

              recorder.start();

              var stopped = new Promise((resolve, reject) => {
                recorder.onstop = resolve;
                recorder.onerror = (event) => {
                  reject(event.name);
                };
              });

              var recorded = wait(recordingTimeMS).then(() => {
                if (recorder.state === "recording") {
                  recorder.stop();
                  self.isRecording = false;
                  $scope.$apply();
                }
              });

              return Promise.all([stopped, recorded,]).then(() => data);
            }).then((recordedChunks) => {
              var recordedBlob = new Blob(recordedChunks, { type: "video/webm", });
              $scope.onPhotoCaptured({data: recordedBlob,});
            });
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
        });
      },
    };
  },]);
