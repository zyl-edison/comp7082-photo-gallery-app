exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./integration-tests/photo-gallery-search-spec.js'],
  framework: 'mocha',
  mochaOpts: {
    reporter: 'spec',
    timeout: 60000
  },
};
