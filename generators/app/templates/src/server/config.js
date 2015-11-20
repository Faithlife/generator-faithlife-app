import path from 'path';
import validator from 'node-validator';
import findConfig from './find-config';

export default findConfig(
	process.env.NODE_ENV || 'internal',
	path.join(path.dirname(module.filename), 'environments'),
	{
		oauthCredentials: {
			consumerToken: validator.isString(),
			consumerSecret: validator.isString(),
		},
		baseUrls: {
			auth: validator.isString(),
			accounts: validator.isString(),
		},
		session: {
			secret: validator.isString(),
		},
	});
