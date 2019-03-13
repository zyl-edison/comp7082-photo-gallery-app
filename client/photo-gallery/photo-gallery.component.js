angular.module('photoGalleryApp').component('photoGallery', {
  templateUrl: 'photo-gallery/photo-gallery.template.html',
  controller: [
    'PhotoGallery',
    'WebCamera',
    function PhotoGalleryController(PhotoGallery, WebCamera) {
      var self = this;
      this.photoIndexPointer = 0;
      this.isSearching = false;
      this.isCameraing = false;

      this.currentPhotoCreateDate = null;
      this.currentPhotoCaption = '';
      this.currentPhotoUrl = '';
      this.currentPhotoLat = null;
      this.currentPhotoLng = null;
      this.currentType = null;
      this.photoList = [];

      this.searchCaption = '';
      this.searchStartdate = '';
      this.searchEnddate = '';
      this.searchNWLat = '';
      this.searchNWLng = '';
      this.searchSELat = '';
      this.searchSELng = '';

      var _updateCurrentPhotoData = function (photo) {
        var context = photo.context;
        var custom, lat, lng;
        self.currentPhotoLat = null;
        self.currentPhotoLng = null;
        self.currentType = photo.resource_type;
        self.currentPhotoCreateDate = new Date(photo.created_at);
        self.currentPhotoCaption = photo.public_id.replace('comp7082/photo-gallery/', '');
        self.currentPhotoUrl = photo.secure_url;
        if (context) {
          custom = context.custom;
          lat = custom.lat;
          lng = custom.lng;
          if (lat && lng) {
            self.currentPhotoLat = lat;
            self.currentPhotoLng = lng;
          }
        }
      };

      var _resetSearch = function () {
        self.searchCaption = '';
        self.searchStartdate = '';
        self.searchEnddate = '';
      };

      this.gotoPhoto = function (count) {
        var photoListSize = this.photoList.length;
        this.photoIndexPointer = this.photoIndexPointer + count;
        if (this.photoIndexPointer < 0) {
          this.photoIndexPointer = photoListSize - 1;
        } else if (this.photoIndexPointer === photoListSize) {
          this.photoIndexPointer = 0;
        }
        _updateCurrentPhotoData(this.photoList[this.photoIndexPointer]);
      };

      this.gotoSearch = function() {
        self.isSearching = true;
        self.isCameraing = false;
      };

      this.search = function() {
        self.isSearching = false;
        self.isCameraing = false;
        PhotoGallery.listPhoto().then(function (response) {
          var data = response.data;
          self.photoList = PhotoGallery.filter(
            self.searchCaption,
            self.searchStartdate,
            self.searchEnddate,
            self.searchNWLng,
            self.searchNWLat,
            self.searchSELng,
            self.searchSELat,
            data
          );

          if (data.length) {
            _updateCurrentPhotoData(data[self.photoIndexPointer]);
          } else {
            self.currentPhotoCreateDate = null;
            self.currentPhotoCaption = '';
            self.currentPhotoUrl = '';
          }
          _resetSearch();
        });
      };

      this.startCamera = function() {
        self.isCameraing = true;
        self.isSearching = false;
      };

      this.onPhotoCaptured = function(data) {
        var type = typeof data;

        if (type === 'string') {
          PhotoGallery.createPhoto(data).then(function (response) {
            self.isSearching = false;
            self.isCameraing = false;
            var data = response.data;
            self.photoList = [data,];
            _updateCurrentPhotoData(data);
          });
        } else {
          var formdata = new FormData();
          formdata.append('file', data);

          WebCamera.createVideo(data).then(function(response) {
            self.isSearching = false;
            self.isCameraing = false;
            var data = response.data;
            self.photoList = [data,];
            _updateCurrentPhotoData(data);
          });
        }
      };
    },
  ],
});
