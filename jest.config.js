const { defaults } = require('jest-config');

module.exports = {
  ...defaults,
  // set verbose to true if you dont want to see logs
  testMatch: ['<rootDir>/tests/**/*.spec.js'],
  verbose: true,
  restoreMocks: true,
  modulePathIgnorePatterns: ['./examples'],
  testPathIgnorePatterns: ['./node_modules'],
  collectCoverage: true,
  collectCoverageFrom: ['lib/**/{!(index),}.js'],
  coverageDirectory: '<rootDir>/coverage-report',
  reporters: ['default', 'jest-junit'],
  coverageThreshold: {
    global: {
      lines: 0,
    },
  },
  silent: false,
};
