// For the glob features check out https://github.com/micromatch/micromatch
module.exports = {
	'*.ts': ['tslint --project .', 'prettier --check'],
	'*.js': ['eslint', 'prettier --check'],
	'*.css': ['stylelint', 'prettier --list-different'],
	'*.scss': ['stylelint --syntax=scss', 'prettier --check'],
	'(*.json|.eslintrc|.prettierrc|.stylelintrc|.markdownlintrc)': [('eslint', 'prettier --check')],
	'*.md': ["markdownlint --ignore 'CHANGELOG.md' --ignore-path '.gitignore'", 'prettier --check'],
	'*.(yml|yaml)': ['prettier --check'],
};
