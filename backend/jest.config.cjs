const { createDefaultPreset } = require('ts-jest');

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    ...createDefaultPreset().transform,
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
