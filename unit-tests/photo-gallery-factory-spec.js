describe('photo gallery factory', function() {

  beforeEach(module('photoGalleryApp'));

  it('can filter with caption', inject(function(PhotoGallery) {
    var photos = [{
      public_id: 'aaa',
    }, {
      public_id: 'bbb',
    }, {
      public_id: 'ccc',
    }];
    expect(PhotoGallery.filter(
      'aaa',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      photos
    ).length).toEqual(1);
  }));

  it('can filter with start date and end date', inject(function(PhotoGallery) {
    var photos = [{
      created_at: '1990-01-01T08:00:00.000Z',
    }, {
      created_at: '2000-01-01T08:00:00.000Z',
    }, {
      created_at: '2019-01-01T08:00:00.000Z',
    }];
    expect(PhotoGallery.filter(
      undefined,
      '01/01/2018',
      '01/01/2020',
      undefined,
      undefined,
      undefined,
      undefined,
      photos
    ).length).toEqual(1);
  }));

  it('can filter with geolocation boundary', inject(function(PhotoGallery) {
    var photos = [{
      context: {
        custom: {
          lat: '48.9236223',
          lng: '-122.0644887',
        },
      },
    }, {
      context: {
        custom: {
          lat: '49.1161032',
          lng: '-121.8140621',
        },
      },
    }, {
      context: {
        custom: {
          lat: '49.2102201',
          lng: '-122.9767526',
        },
      },
    }];
    expect(PhotoGallery.filter(
      undefined,
      undefined,
      undefined,
      '-123.1209917',
      '49.2796587',
      '-122.5501312',
      '49.1064718',
      photos
    ).length).toEqual(1);
  }));
});
