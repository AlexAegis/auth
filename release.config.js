module.exports = {
	extends: 'semantic-release-monorepo',
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		[
			'@semantic-release/npm',
			{
				npmPublish: false,
				tarballDir: 'dist',
			},
		],
		[
			'@semantic-release/github',
			{
				assets: 'dist/*.tgz',
			},
		],
	],
	branches: ['master', 'next'],
	publishConfig: {
		registry: 'https://registry.npmjs.org/',
		tag: 'latest',
	},
};
