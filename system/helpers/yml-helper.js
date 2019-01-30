import fs from 'fs';
import yaml from 'js-yaml';

/**
 * PARSE
 *
 * Read yaml file and convert it into an object/array. Use adapter pattern so
 * that it will easily to replace aother js-yaml module without touch other
 * piece in the codebase
 *
 * @param  {String} path  yaml file path
 * @return {Object/Array} parse result
 */
export const parse = (path) => {
  return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
};
