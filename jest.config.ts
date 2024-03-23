/* eslint-disable @typescript-eslint/no-var-requires */
const { getJestProjects } = require('@nx/jest');

export default {
	testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
	transform: {
		'^.+\\.(ts|js|html)$': 'ts-jest',
	},
	resolver: '@nx/jest/plugins/resolver',
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageReporters: ['html', 'json', 'lcov', 'cobertura'],
	projects: getJestProjects(),
};
