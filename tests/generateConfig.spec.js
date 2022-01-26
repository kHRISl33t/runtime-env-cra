const generateConfig = require('../lib/generateConfig');
const { promises: fsp } = require('fs');

describe('runtime-env-cra', () => {
  afterAll(async () => {
    await fsp.unlink('./tests/utils/runtime-config.js').catch(() => { });
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

  it('should throw error if NODE_ENV is production, env var is not found in shell, and strict is not set', async () => {
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

  it('should default to env if NODE_ENV is production, env var is not found in shell, and strict is set to false', async () => {
    process.env.NODE_ENV = 'production';

    let config;
    let error;

    try {
      config = await generateConfig({
        envConfig: './tests/utils/runtime-config.js',
        envFile: './tests/utils/.env',
        strict: false
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

  it('should throw error if env var is not found in shell, and strict is true regardless of environment', async () => {
    process.env.NODE_ENV = 'development';

    let config;
    let error;

    try {
      config = await generateConfig({
        envConfig: './tests/utils/runtime-config.js',
        envFile: './tests/utils/.env',
        strict: true
      });
    } catch (err) {
      error = err;
    }

    expect(config).toBeUndefined();
    expect(error).toBeDefined();
    expect(error.message).toEqual('Error getting \'TEST_VAR\' from process.env');
  });

  it('should generate a runtime-config.js file successfully on Production', async () => {
    process.env.NODE_ENV = 'Production';
    process.env.TEST_VAR = 'TEST_VALUE';


    config = await generateConfig({
      envConfig: './tests/utils/runtime-config.js',
      envFile: './tests/utils/.env',
    });

    expect(config).toBeDefined();
    expect(config).toEqual(
      'window.__RUNTIME_CONFIG__ = {"TEST_VAR":"TEST_VALUE"};',
    );
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

  it('should parse a CRLF .env file successfully', async () => {
    process.env.NODE_ENV = 'development';

    const config = await generateConfig({
      envConfig: './tests/utils/runtime-config.js',
      envFile: './tests/utils/.env.crlf',
    });

    expect(config).toBeDefined();
    expect(config).toEqual(
      'window.__RUNTIME_CONFIG__ = {"TEST_VAR":"TEST_VALUE"};',
    );
  });

  it('should ignore .env file comments and ignore EOL whitespace', async () => {
    process.env.NODE_ENV = 'development';

    const config = await generateConfig({
      envConfig: './tests/utils/runtime-config.js',
      envFile: './tests/utils/.env.comments',
    });

    expect(config).toBeDefined();
    expect(config).toEqual(
      'window.__RUNTIME_CONFIG__ = {"TEST_VAR":"TEST_VALUE","TEST_VAR2":"TEST_VALUE2","TEST_VAR3":"a full sentence with spaces and\\t\\ttabs"};',
    );
  });
});
