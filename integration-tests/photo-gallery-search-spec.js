const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;

describe('photo gallery search', () => {

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
});
