angular.module('photoGalleryApp').factory('PhotoGallery', [
  '$http',
  function($http) {
    return {
      createPhoto: function(imageDataUrl) {
        return $http.post('/api/v1/photo', {
          imageDataUrl: imageDataUrl,
        });
      },
      listPhoto: function() {
        return $http.get('/api/v1/photo');
      }
    };
  },
]);
