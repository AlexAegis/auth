// For the glob features check out https://github.com/micromatch/micromatch
module.exports = {
	'*.ts': ['tslint --project .', 'prettier --check'],
	'*.js': ['eslint', 'prettier --check'],
	'*.css': ['stylelint', 'prettier --list-different'],
	'*.scss': ['stylelint --syntax=scss', 'prettier --check'],
	'(*.json|.eslintrc|.prettierrc|.stylelintrc|.markdownlintrc)': [('eslint', 'prettier --check')],
	'*.md': ['markdownlint', 'prettier --check'],
	'*.(yml|yaml)': ['yamllint', 'prettier --check'],
	'codecov.yml': ['curl --data-binary @- https://codecov.io/validate <'],
};
