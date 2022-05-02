/* eslint-disable @typescript-eslint/no-var-requires */
const { getJestProjects } = require('@nrwl/jest');

module.exports = {
	testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
	transform: {
		'^.+\\.(ts|js|html)$': 'ts-jest',
	},
	resolver: '@nrwl/jest/plugins/resolver',
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageReporters: ['html', 'json', 'lcov', 'cobertura'],
	projects: getJestProjects(),
};