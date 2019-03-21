const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;

describe('photo gallery', () => {

  describe('search', () => {
    beforeEach(() => {
      browser.get('http://localhost:8000');
    });

    it('should show photos with caption in search', () => {
      const gotoSeachButton = element(by.id('button-goto-search'));
      browser.sleep(1000);
      gotoSeachButton.click();
      browser.sleep(1000);
      const captionSearchInput = element(by.id('photo-gallery-search-caption-input'));
      const searchButton = element(by.id('button-search'));
      captionSearchInput.sendKeys('caption');
      browser.sleep(1000);
      searchButton.click();
      const captionInput = element(by.id('photo-gallery-caption-input'));
      captionInput.getAttribute('value').then((text) => {
        assert(text.includes('caption'));
      });
      browser.sleep(1000);
    });

    it('should show photos with start date and end date in search', () => {
      const gotoSeachButton = element(by.id('button-goto-search'));
      browser.sleep(1000);
      gotoSeachButton.click();
      browser.sleep(1000);
      const startDateSearchInput = element(by.id('photo-gallery-search-startdate-input'));
      const endDateSearchInput = element(by.id('photo-gallery-search-enddate-input'));
      const searchButton = element(by.id('button-search'));
      startDateSearchInput.sendKeys('01/01/2019');
      browser.sleep(1000);
      endDateSearchInput.sendKeys('01/31/2019');
      browser.sleep(1000);
      searchButton.click();
      const displayDateElement = element(by.id('photo-gallery-display-date'));
      displayDateElement.getText().then((text) => {
        const createDate = new Date(text);
        assert(createDate >= new Date('01/01/2019'));
        assert(createDate <= new Date('01/31/2019'));
      });
    });

    it('should show 5 photos within geolocation boundary', () => {
      const gotoSeachButton = element(by.id('button-goto-search'));
      browser.sleep(1000);
      gotoSeachButton.click();
      browser.sleep(1000);

      const nwlatSearchInput = element(by.id('photo-gallery-search-nwlat-input'));
      const nwlngSearchInput = element(by.id('photo-gallery-search-nwlng-input'));
      const selatSearchInput = element(by.id('photo-gallery-search-selat-input'));
      const selngSearchInput = element(by.id('photo-gallery-search-selng-input'));
      const searchButton = element(by.id('button-search'));

      nwlatSearchInput.sendKeys('49.2796587');
      browser.sleep(1000);
      nwlngSearchInput.sendKeys('-123.1209917');
      browser.sleep(1000);
      selatSearchInput.sendKeys('49.1064718');
      browser.sleep(1000);
      selngSearchInput.sendKeys('-122.5501312');
      browser.sleep(1000);

      searchButton.click();
      const photoCountElement = element(by.id('photo-gallery-photo-count'));
      photoCountElement.getText().then((text) => {
        expect(text).to.equal('1 / 2');
      });
    });
  });

  describe('map view', () => {
    beforeEach(() => {
      browser.get('http://localhost:8000');
    });

    it('should show map view when click map button', () => {
      const gotoSeachButton = element(by.id('button-goto-map'));
      browser.sleep(1000);
      gotoSeachButton.click();
      browser.sleep(5000);

      const map = element(by.id('map'));
      expect(map).to.not.be.null;
    });

    it('should show map markers on the map view', () => {
      const gotoSeachButton = element(by.id('button-goto-map'));
      browser.sleep(1000);
      gotoSeachButton.click();
      browser.sleep(5000);

      const markers = element(by.css('img[usemap^="#gmimap"]'));
      expect(markers).to.not.be.null;
    });
  });

});
