angular.module('photoGalleryApp').component('photoGallery', {
  templateUrl: 'photo-gallery/photo-gallery.template.html',
  controller: [
    'PhotoGallery',
    function PhotoGalleryController(PhotoGallery) {
      var self = this;
      this.photoIndexPointer = 0;
      this.isSearching = false;
      this.isCameraing = false;

      this.currentPhotoCreateDate = null;
      this.currentPhotoCaption = '';
      this.currentPhotoUrl = '';
      this.photoList = [];

      this.searchCaption = '';
      this.searchStartdate = '';
      this.searchEnddate = '';

      var _updateCurrentPhotoData = function (photo) {
        self.currentPhotoCreateDate = new Date(photo.created_at);
        self.currentPhotoCaption = photo.public_id.replace('comp7082/photo-gallery/', '');
        self.currentPhotoUrl = photo.secure_url;
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
          if (self.searchCaption) {
            data = data.filter(function (d) {
              return d.public_id.includes(self.searchCaption);
            });
          }

          if (self.searchStartdate) {
            data = data.filter(function (d) {
              var createDate = new Date(d.created_at);
              var startDate = new Date(self.searchStartdate);
              return createDate >= startDate;
            });
          }
          if (self.searchEnddate) {
            data = data.filter(function (d) {
              var createDate = new Date(d.created_at);
              var endDate = new Date(self.searchEnddate);
              return createDate <= endDate;
            });
          }

          self.photoList = data;

          if (data.length) {
            _updateCurrentPhotoData(data[self.photoIndexPointer]);
          } else {
            self.currentPhotoCreateDate = null;
            self.currentPhotoCaption = '';
            self.currentPhotoUrl = '';
          }
          _resetSearch();
        });;
      };

      this.startCamera = function() {
        self.isCameraing = true;
        self.isSearching = false;
      };

      this.onPhotoCaptured = function(data) {
        self.isSearching = false;
        self.isCameraing = false;

        PhotoGallery.createPhoto(data).then(function (response) {
          var data = response.data;
          self.photoList = [data];
          _updateCurrentPhotoData(data);
        });;
      };
    },
  ],
});
