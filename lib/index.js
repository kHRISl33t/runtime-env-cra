#!/usr/bin/env node

const yargs = require('yargs');

const generateConfig = require('./generateConfig');
const { constants } = require('./utils');

const argv = yargs
  .option('config-name', {
    alias: 'cn',
    description: 'Location and file name to generate.',
    default: './runtime-env.js',
    type: 'string',
  })
  .option('env-file', {
    alias: 'ef',
    description: 'Location and name of your .env file.',
    default: './.env',
    type: 'string',
  })
  .help()
  .alias('help', 'h').argv;

(async () => {
  try {
    const envConfig = argv['config-name'];
    const envFile = argv['env-file'];

    console.log(`
  Provided flags:
    --config-name = ${envConfig}
    --env-file = ${envFile}

  Your environment variables will be available on '${constants.runtimeConfigPath}'
  `);

    let result;

    try {
      result = await generateConfig({
        envConfig,
        envFile,
      });
    } catch (err) {
      throw new Error(err.message);
    }

    console.log(`Successfully generated your runtime-env config!
  Result: ${result}

  Thank you for using runtime-env-cra!
  `);
  } catch (err) {
    console.error(`Error creating ${argv['config-name']}:`, err);
    process.exit(1);
  }
})();
