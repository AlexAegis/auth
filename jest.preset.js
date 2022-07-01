/* eslint-disable @typescript-eslint/no-var-requires */
const nxPreset = require('@nrwl/jest/preset').default;

module.exports = { ...nxPreset, coverageReporters: ['html', 'json', 'lcov', 'cobertura'] };
