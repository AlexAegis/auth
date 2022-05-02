export const settings = { bullet: '*', tablePipeAlign: false, listItemIndent: false };

export const plugins = [
	require('remark-preset-lint-recommended'),
	require('remark-preset-lint-consistent'),
	[require('remark-lint-list-item-indent'), [false]],
	[require('remark-lint-maximum-line-length'), ['error', 80]],
];
