require('babel/register')({
	only: __dirname + '/src',
});

var env = process.env.NODE_ENV;
global.DEBUG = env !== 'production' && env !== 'internal';
global.PRODUCTION = env === 'production';
global.CLIENT = false;

require('./src/server');
