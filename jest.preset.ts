/* eslint-disable @typescript-eslint/no-var-requires */
const nxPreset = require('@nrwl/jest/preset');

module.exports = { ...nxPreset, coverageReporters: ['html', 'json', 'lcov', 'cobertura'] };
