import express from 'express';
import request from 'request';

export function createProxy({ baseUrl, oauthCredentials, getCurrentUserCredentials }) {
	if (typeof baseUrl !== 'string') {
		throw new Error('baseUrl is required');
	}

	const { consumerToken, consumerSecret } = oauthCredentials || {};
	if (typeof consumerToken !== 'string' || typeof consumerSecret !== 'string') {
		throw new Error('oauthCredentials must specify consumerToken and consumerSecret');
	}

	if (typeof getCurrentUserCredentials !== 'function') {
		getCurrentUserCredentials = () => ({});
	}

	const app = express();

	app.use(function(req, res) {
		const { oauthToken, oauthSecret } = getCurrentUserCredentials(req) || {};

		const proxyRequest = request({
			baseUrl: baseUrl,
			url: req.url,
			oauth: {
				consumer_key: consumerToken,
				consumer_secret: consumerSecret,
				token: oauthToken,
				token_secret: oauthSecret,
			},
		});

		req.pipe(proxyRequest);
		proxyRequest.pipe(res);
	});

	return app;
}
