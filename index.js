import System from './system';

const VERSIONS = Object.freeze({
  ONE: 'version1',
});

try {
  const system = new System('comp7082-photo-gallery-app-server', VERSIONS.ONE, __dirname);
  system.boot();
} catch (e) {
  console.log(e);
}
