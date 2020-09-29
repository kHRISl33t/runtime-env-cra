#!/usr/bin/env node

const fs = require('fs').promises;
const { constants } = require('fs');
const yargs = require('yargs');

const argv = yargs
    .option('config-name', {
        alias: 'cn',
        description: 'Location and file name to generate.',
        default: './runtime-env.js',
        type: 'string',
    })
    .option('env-file', {
      alias: 'ef',
      description: 'Location and name of the your .env file.',
      default: './.env',
      type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

const ENV_CONFIG = argv["config-name"];
const ENV = argv["env-file"];
const DEVELOPMENT = 'development';
const runtimeConfig = {};
const runtimeConfigPath = `window.__RUNTIME_CONFIG__`

console.log(`
  Provided flags:
    --config-name = ${ENV_CONFIG}
    --env-file = ${ENV}

  Your environment variables will be available on '${runtimeConfigPath}'
`)

const generateConfig = (config) =>
  `${runtimeConfigPath} = ${JSON.stringify(config)};`;

(async () => {
  let envConfigExists = true;

  try {
    await fs.access(ENV_CONFIG, constants.F_OK);
  } catch (err) {
    envConfigExists = false;
  }

  // if ENV_CONFIG exists, delete the file
  if (envConfigExists) {
    await fs.unlink(ENV_CONFIG);
  }


  // make sure ENV file exists
  try {
    await fs.access(ENV, constants.F_OK);
  } catch (err) {
    throw err;
  }

  // read content of the ENV file
  const content = await fs.readFile(ENV, 'utf8');

  content.split('\n').forEach((line) => {
    // get first index of '='
    const equalSignIndex = line.indexOf('=');
    // get length of string
    const lengthOfString = line.length;

    // returns -1 if there is no match for the given char
    if (equalSignIndex !== -1) {
      /**
       * create key value pairs of env vars
       * splitting key value pairs by equal sign index
       */
      const key = line.slice(0, equalSignIndex);
      const value = line.slice(equalSignIndex + 1, lengthOfString);

      // if NODE_ENV is DEVELOPMENT always use the provided ENV file
      // otherwise always use the value from process.env
      if (process.env.NODE_ENV === DEVELOPMENT) {
        runtimeConfig[key] = value;
      } else {
        if (!process.env[key])
          throw new Error(`Error getting '${key}' from process.env`);
        runtimeConfig[key] = process.env[key];
      }
    }
  });

  await fs.writeFile(
    ENV_CONFIG,
    generateConfig(runtimeConfig),
    'utf-8',
  );

console.log(`Successfully generated your runtime-env config!

Result: ${generateConfig(runtimeConfig)}

Thank you for using runtime-env-cra!
`);

})().catch((err) => {
  console.error(`Error creating ${ENV_CONFIG}:`, err);
  process.exit(1);
});
