module.exports = {
  name: 'temp',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/temp',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
