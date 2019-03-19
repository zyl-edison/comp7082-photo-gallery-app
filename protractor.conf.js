exports.config = {
  specs: ['./integration-tests/photo-gallery-search-spec.js'],
  framework: 'mocha',
  mochaOpts: {
    reporter: 'spec',
    timeout: 60000
  },
};
