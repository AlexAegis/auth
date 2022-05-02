module.exports = {
	name: 'ngrx',
	preset: '../../jest.preset.js',
	coverageDirectory: '../../coverage/libs/ngrx',

	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.spec.json',
			stringifyContentPathRegex: '\\.(html|svg)$',
		},
	},
	snapshotSerializers: [
		'jest-preset-angular/build/serializers/no-ng-attributes',
		'jest-preset-angular/build/serializers/ng-snapshot',
		'jest-preset-angular/build/serializers/html-comment',
	],
	transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
};
