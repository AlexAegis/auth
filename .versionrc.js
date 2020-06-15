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
	bumpFiles: ['package.json', ...libs],
};
