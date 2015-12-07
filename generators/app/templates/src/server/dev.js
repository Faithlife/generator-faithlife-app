import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.dev.config.js';
import httpProxy from 'http-proxy';
import forever from 'forever-monitor';

let proxyPort = process.env.PROXY_PORT || 3001;

export function addWebpackDevProxy(app) {
	let proxy = httpProxy.createProxyServer({
		changeOrigin: true,
	});

	app.all('/dist/*', function(req, res) {
		proxy.web(req, res, {
			target: `http://127.0.0.1:${proxyPort}`,
		});
	});

	proxy.on('error', function(err, req, res) {
		console.error(`Error proxying ${req.url}: ${err.stack}`);
		res.status(500).send('Error');
	});
}

export function startWebpackDevServer() {
	let bundleStart = null;
	let compiler = webpack(webpackConfig);

	compiler.plugin('compile', function() {
		console.log('Bundling...');
		bundleStart = Date.now();
	});

	compiler.plugin('done', function() {
		console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms');
	});

	let bundler = new WebpackDevServer(compiler, {
		info: false,
		quiet: true,
		hot: false,
		inline: true,
		host: 'localhost',
		colors: true,
		contentBase: 'dist',
		publicPath: '/dist/',
		stats: {
			colors: true,
		},
		watchOptions: {
			poll: 1000,
		},
	});

	bundler.listen(proxyPort, 'localhost', function() {
		console.log(`Webpack dev server running on port ${proxyPort}`);
	});
}

export function startForeverMonitorApp(appPath) {
	let app = new forever.Monitor(appPath, {
		watch: true,
		watchDirectory: './src',
		usePolling: true,
	}).start();

	app.on('watch:restart', function(info) {
		console.log(`\t${info.stat} changed`);
	});

	process.on('SIGTERM', function() {
		app.stop();
	});
}
