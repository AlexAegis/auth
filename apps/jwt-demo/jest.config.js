module.exports = {
	name: 'jwt-demo',
	preset: '../../jest.config.js',
	coverageDirectory: '../../coverage/apps/jwt-demo',
	snapshotSerializers: [
		'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
		'jest-preset-angular/build/AngularSnapshotSerializer.js',
		'jest-preset-angular/build/HTMLCommentSerializer.js',
	],
};
