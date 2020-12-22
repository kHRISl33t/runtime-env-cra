/* eslint-disable prettier/prettier */
const fs = require('fs').promises;
const generateConfig = require('../lib/generateConfig');

describe('runtime-env-cra', () => {
  afterAll(async () => {
    await fs.unlink('./tests/utils/runtime-config.js').catch(() => { });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error if = sign is missing in the provided .env file', async () => {
    let config;
    let error;

    try {
      config = await generateConfig({
        envConfig: './tests/utils/runtime-config.js',
        envFile: './tests/utils/.wrong-env',
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(config).toBeUndefined();
    expect(error.message).toEqual(
      'Could not generate runtime config. Check your .env format!',
    );
  });

  it('should generate a runtime-config.js file successfully', async () => {
    process.env.NODE_ENV = 'development';

    const config = await generateConfig({
      envConfig: './tests/utils/runtime-config.js',
      envFile: './tests/utils/.env',
    });

    expect(config).toBeDefined();
    expect(config).toEqual(
      'window.__RUNTIME_CONFIG__ = {"TEST_VAR":"TEST_VALUE"};',
    );
  });

  it('should throw an error if the provided .env not exists', async () => {
    process.env.NODE_ENV = 'development';

    let config;
    let error;

    try {
      config = await generateConfig({
        envConfig: './tests/utils/runtime-config.js',
        envFile: './tests/utils/.notexistsenv',
      });
    } catch (err) {
      error = err;
    }

    expect(config).toBeUndefined();
    expect(error).toBeDefined();
    expect(error.message).toEqual(
      'ENOENT: no such file or directory, access \'./tests/utils/.notexistsenv\'',
    );
  });

  it('should throw error if NODE_ENV is production and env var is not found in shell', async () => {
    process.env.NODE_ENV = 'production';

    let config;
    let error;

    try {
      config = await generateConfig({
        envConfig: './tests/utils/runtime-config.js',
        envFile: './tests/utils/.env',
      });
    } catch (err) {
      error = err;
    }

    expect(config).toBeUndefined();
    expect(error).toBeDefined();
    expect(error.message).toEqual('Error getting \'TEST_VAR\' from process.env');
  });

  it('should parse the TEST_VAR value from the shell when NODE_ENV is not set to development', async () => {
    process.env.TEST_VAR = 'TEST_VALUE';

    let config;
    let error;

    try {
      config = await generateConfig({
        envConfig: './tests/utils/runtime-config.js',
        envFile: './tests/utils/.env',
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeUndefined();
    expect(config).toBeDefined();
    expect(config).toEqual(
      'window.__RUNTIME_CONFIG__ = {"TEST_VAR":"TEST_VALUE"};',
    );
  });
});
