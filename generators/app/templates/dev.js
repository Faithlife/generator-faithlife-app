require('babel/register')({
	only: __dirname + '/src',
});

var dev = require('./src/server/dev');
dev.startWebpackDevServer();
dev.startForeverMonitorApp('./server.js');