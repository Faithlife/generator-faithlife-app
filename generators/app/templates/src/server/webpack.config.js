/* eslint-disable no-var */

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var projectRoot = path.resolve(__dirname, '../../');

module.exports = {
	entry: {
		main: path.join(projectRoot, 'src/app/client/main.jsx'),
	},

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(projectRoot, './dist'),
	},

	resolve: {
		root: [
			path.resolve(projectRoot, './node_modules'),
		],
		extensions: [ '', '.js', '.jsx' ],
		modulesDirectories: [ 'node_modules' ],
	},

	module: {
		loaders: [
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=100000' },
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader'),
			},
			{
				test: /.less$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less-loader'),
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: [ /node_modules/ ],
			},
		],
	},

	plugins: [
		new ExtractTextPlugin('style.css', {
			allChunks: true,
		}),
	],
};
