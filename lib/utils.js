const { promisify } = require('util');
const fs = require('fs');

const constants = {
  DEVELOPMENT: 'development',
  runtimeConfigPath: 'window.__RUNTIME_CONFIG__',
};

const generateJSON = (config) =>
  `${constants.runtimeConfigPath} = ${JSON.stringify(config)};`;

module.exports = {
  generateJSON,
  constants,
  accessP: promisify(fs.access),
  unlinkP: promisify(fs.unlink),
  readFileP: promisify(fs.readFile),
  writeFileP: promisify(fs.writeFile)
};
