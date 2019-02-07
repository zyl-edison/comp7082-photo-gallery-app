describe('geo location factory', function() {

  beforeEach(module('geoLocationApp'));

  it('can detect the given geolocation within boundary', inject(function(GeoLocation) {
    expect(GeoLocation.isWithinboundingbox(
      -122.76478420000001,
      49.1511311,
      -123.1487326,
      49.1746194,
      -122.5369989,
      49.0113471,
    )).toEqual(true);
  }));

  it('can detect the given geolocation out of boundary', inject(function(GeoLocation) {
    expect(GeoLocation.isWithinboundingbox(
      -122.0644887,
      48.9236223,
      -123.1487326,
      49.1746194,
      -122.5369989,
      49.0113471,
    )).toEqual(false);
  }));
});
