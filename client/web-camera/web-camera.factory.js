angular.module('webCameraApp').factory('WebCamera', [
  '$q',
  '$http',
  function($q, $http) {
    return {
      createVideo: function(data) {
        return $q(function(resolve) {
          navigator.geolocation.getCurrentPosition(function(pos) {
            var formdata = new FormData();
            formdata.append('file', data);
            formdata.append('geolocation', JSON.stringify({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            }));

            $http.post('/api/v1/video', formdata, { headers: { 'Content-Type': undefined } })
              .then(function (response) {
                resolve(response);
            });
          });
        });
      },
    };
  },
]);
