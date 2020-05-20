const terserPlugin = require('rollup-plugin-terser').terser;
const gzipPlugin = require('rollup-plugin-gzip').default;

/**
 * For terser options: https://github.com/terser/terser#minify-options
 * Include them in the options object
 * @param {object} config
 */
function patchRollupConfig(config) {
	config.plugins.push(terserPlugin({}));
	config.plugins.push(gzipPlugin({}));
	return config;
}

module.exports = patchRollupConfig;
