module.exports = {
	name: 'jwt',
	preset: '../../jest.config.js',
	coverageDirectory: '../../coverage/libs/jwt',
	snapshotSerializers: [
		'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
		'jest-preset-angular/build/AngularSnapshotSerializer.js',
		'jest-preset-angular/build/HTMLCommentSerializer.js',
	],
};
