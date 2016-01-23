/* eslint-disable no-var */

var config = require('./webpack.config');

module.exports = Object.assign({}, config, {
	devtool: '#source-map',
});
