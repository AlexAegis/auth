module.exports = {
	name: 'jwt',
	preset: '../../jest.config.js',
	coverageDirectory: '../../coverage/libs/jwt',
	snapshotSerializers: [
		'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
		'jest-preset-angular/build/AngularSnapshotSerializer.js',
		'jest-preset-angular/build/HTMLCommentSerializer.js',
	],
	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	globals: {
		'ts-jest': {
			tsConfig: '<rootDir>/tsconfig.spec.json',
			stringifyContentPathRegex: '\\.(html|svg)$',
			astTransformers: {
				before: [
					'jest-preset-angular/build/InlineFilesTransformer',
					'jest-preset-angular/build/StripStylesTransformer',
				],
			},
		},
	},
};