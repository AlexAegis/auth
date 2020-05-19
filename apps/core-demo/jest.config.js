module.exports = {
	name: 'core-demo',
	preset: '../../jest.config.js',
	coverageDirectory: '../../coverage/apps/core-demo',
	snapshotSerializers: [
		'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
		'jest-preset-angular/build/AngularSnapshotSerializer.js',
		'jest-preset-angular/build/HTMLCommentSerializer.js',
	],
};
