angular.module('photoGalleryApp').factory('PhotoGallery', [
  '$q',
  '$http',
  'GeoLocation',
  function($q, $http, GeoLocation) {
    return {
      createPhoto: function(imageDataUrl) {
        return $q(function(resolve) {
          navigator.geolocation.getCurrentPosition(function(pos) {
            $http.post('/api/v1/photo', {
              imageDataUrl: imageDataUrl,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }).then(function(response) {
              resolve(response);
            });
          });
        });
      },
      listPhoto: function() {
        return $http.get('/api/v1/photo');
      },
      filter: function(caption, startdate, enddate, nwLng, nwlat, seLng, seLat, photos) {
        var data = photos;

        if (caption) {
          data = data.filter(function (d) {
            return d.public_id.includes(caption);
          });
        }

        if (startdate) {
          data = data.filter(function (d) {
            var createDate = new Date(d.created_at);
            var startDate = new Date(startdate);
            return createDate >= startDate;
          });
        }
        if (enddate) {
          data = data.filter(function (d) {
            var createDate = new Date(d.created_at);
            var endDate = new Date(enddate);
            return createDate <= endDate;
          });
        }

        if (nwLng &&
            nwlat &&
            seLng &&
            seLat) {
            data = data.filter(function (d) {
            var context = d.context;
            var custom, lng, lat;
            if (context) {
              custom = context.custom;
              lng = custom.lng;
              lat = custom.lat;
              if (lng && lat) {
                return GeoLocation.isWithinboundingbox(
                  +lng,
                  +lat,
                  +nwLng,
                  +nwlat,
                  +seLng,
                  +seLat,
                );
              }
            }
          });
        }
        return data;
      }
    };
  },
]);
