const fs = require('fs');

const foldersToCheck = ['libs', 'apps'];

const libs = foldersToCheck
	.reduce(
		(acc, dir) =>
			acc.push(...fs.readdirSync(dir).map((project) => `${dir}/${project}/package.json`)) &&
			acc,
		[]
	)
	.filter((p) => fs.existsSync(p));

module.exports = {
	bumpFiles: [
		'package.json',
		{
			filename: 'readme.md',
			updater: 'tools/updaters/readme-updater.js',
		},
		{
			filename: '.github/version.txt',
			type: 'plain-text',
		},
		...libs,
	],
	skip: {
		commit: false,
		changelog: false,
		tag: false,
	},
};
