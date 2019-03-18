angular.module('mapApp')
  .directive('map', ['PhotoGallery', function(PhotoGallery) {
    return {
      restrict: 'E',
      template: '<div id="map"></div>',
      // controller: ['$scope', function($scope) {

      // }],
      controllerAs: '$ctrl',
      link: function() {
        PhotoGallery.listPhoto().then(function (response) {
          var mapElm = document.getElementById('map');
          var map = new google.maps.Map(mapElm, {
            center: {lat: 49.186332, lng: -122.849773,},
            zoom: 9,
            disableDefaultUI: true,
          });

          var data = response.data;
          data = data.filter((d) => {
            return d.context && d.context.custom && d.context.custom.lat && d.context.custom.lng;
          }).map((resource) => {
            const {lat, lng} = resource.context.custom;
            resource.location = {
              lat: Number(lat),
              lng: Number(lng),
            };
            return resource;
          });

          var markers = data.map(function(d) {
            var media = d.resource_type === 'image' ? `<img src="${d.secure_url}" style="width: 200px;">` : `<video src="${d.secure_url}" width="200" controls></video>`;
            var content = `
              <div class="content">
                ${media}
              </div>
            `;

            var infowindow = new google.maps.InfoWindow({
              content: content,
            });
            var m = new google.maps.Marker({
              position: d.location,
              title: d.public_id,
              infowindow: infowindow,
            });

            m.addListener('click', function() {
              markers.forEach(function(marker) {
                marker.infowindow.close(map, marker);
              });
              infowindow.open(map, m);
            });
            return m;
          });

          new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',});
        });
      },
    };
  },]);
