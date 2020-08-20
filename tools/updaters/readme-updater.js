/**
 *
 * @param {string} contents
 */
module.exports.readVersion = function (contents) {
	return contents.match(/"\^([0-9]+\.[0-9]+\.[0-9]+)"/)[1];
};

/**
 *
 * @param {string} contents
 * @param {string} version
 */
module.exports.writeVersion = function (contents, version) {
	return contents.replace(/"\^[0-9]+\.[0-9]+\.[0-9]+"/, `"^${version}"`);
};
