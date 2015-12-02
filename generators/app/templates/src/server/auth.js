import express from 'express';
import querystring from 'querystring';
import httpClient from 'request';

const temporaryCredentials = 'temporarytoken';
const authorize = 'authorize';
const accessToken = 'accesstoken';

const defaultBaseUrl = 'https://auth.faithlife.com/v1/';

const verifyPath = '/verify';

const defaultAccountsClient = {
	getCurrentUser() {
		return Promise.resolve({ id: '-1' });
	},
};

export function createAuthApp({ useHttpsCallback, baseUrl, oauthCredentials, getSession, getAccountsClient } = {}) {
	if (!oauthCredentials) {
		throw new Error('OAuth credentials are required.');
	}

	const { consumerToken, consumerSecret } = oauthCredentials;
	if (!consumerToken || !consumerSecret) {
		throw new Error('OAuth credentials are required.');
	}

	if (typeof getSession !== 'function') {
		throw new Error('getSession is required.');
	}

	if (typeof getAccountsClient === 'function') {
		getAccountsClient = (function(getAccountsClient) {
			return request => getAccountsClient(request) || defaultAccountsClient;
		})(getAccountsClient);
	} else {
		getAccountsClient = () => defaultAccountsClient;
	}

	const app = express();
	const urlPrefix = useHttpsCallback ? 'https://' : 'http://';

	const baseRequest = httpClient.defaults({ baseUrl: baseUrl || defaultBaseUrl });

	app.get('/signin', function(request, response, next) {
		const getCurrentUserRequest = getAccountsClient(request)
			.getCurrentUser()
			.catch(() => defaultAccountsClient.getCurrentUser());

		const temporaryCredentialsRequest = new Promise(function(accept, reject) {
			const callbackUrl = [ urlPrefix, request.headers.host, request.baseUrl, verifyPath ].join('');
			baseRequest.post(
				{
					url: temporaryCredentials,
					oauth: {
						callback: callbackUrl,
						consumer_key: consumerToken,
						consumer_secret: consumerSecret,
					},
				},
				function(error, httpResponse, body) {
					return error ? reject(error) : accept(body);
				});
		}).then(function(body) { return querystring.parse(body); });

		const callback = request.query.callback;
		Promise.all([ getCurrentUserRequest, temporaryCredentialsRequest ])
			.then(function([{ id }, { oauth_token, oauth_token_secret }]) {
				if (id !== '-1') {
					return response.redirect(callback || '/');
				}

				const session = getSession(request);
				session.setValue('temporarySecret', oauth_token_secret);
				session.setValue('callback', callback);

				return response.redirect([ baseUrl, authorize, '?', querystring.stringify({ oauth_token: oauth_token }) ].join(''));
			})
			.catch(function(error) {
				console.error('Error creating temporary credentials: ' + JSON.stringify(error));
				return next();
			});
	});

	app.get(verifyPath, function(request, response, next) {
		const session = getSession(request);
		const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } = request.query;
		const temporarySecret = session.getValue('temporarySecret');

		if (!oauthToken || !oauthVerifier || !temporarySecret) {
			return next();
		}

		const callback = session.getValue('callback') || '/';
		session.deleteValue('temporarySecret');
		session.deleteValue('callback');

		baseRequest.post(
			{
				url: accessToken,
				oauth: {
					consumer_key: consumerToken,
					consumer_secret: consumerSecret,
					token: oauthToken,
					token_secret: temporarySecret,
					verifier: oauthVerifier,
				},
			},
			function(error, httpResponse, body) {
				if (error) {
					console.error('Error getting final credentials: ' + JSON.stringify(error));
					return next();
				}

				const { oauth_token: oauthToken, oauth_token_secret: oauthTokenSecret } = querystring.parse(body);
				session.setValue('oauthToken', oauthToken);
				session.setValue('oauthSecret', oauthTokenSecret);

				response.redirect(callback);
			});
	});

	app.post('/signout', function(request, response) {
		const session = getSession(request);

		session.deleteValue('oauthToken');
		session.deleteValue('oauthSecret');

		if (request.headers.accept === 'application/json') {
			response.status(200).send(JSON.stringify({ success: true }));
		} else {
			response.redirect(request.query.callback || '/');
		}
	});

	app.getCurrentUserCredentials = function getCurrentUserCredentials(request) {
		const session = getSession(request);

		return { oauthToken: session.getValue('oauthToken'), oauthSecret: session.getValue('oauthSecret') };
	};

	return app;
}
