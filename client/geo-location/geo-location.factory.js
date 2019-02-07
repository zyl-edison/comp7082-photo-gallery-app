angular.module('geoLocationApp').factory('GeoLocation', [
  function() {
    return {
      isWithinboundingbox: function(lng, lat, nwLng, nwLat, seLng, seLat) {
        return (lat <= nwLat && lat >= seLat) && (lng >= nwLng && lng <= seLng);
      }
    };
  },
]);
