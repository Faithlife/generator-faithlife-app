/* eslint-disable no-var */

var config = require('./webpack.config');
var webpack = require('webpack');

module.exports = Object.assign({}, config, {
	plugins: config.plugins.concat(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({ output: { comments: false }})),
});
