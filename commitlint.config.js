module.exports = {
	extends: ['@commitlint/config-conventional'],
	type: ['build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
	rules: {
		'scope-enum': [2, 'always', ['core', 'token', 'package', 'docs', 'lint', 'changelog']],
	},
};
