import request from 'request';
import config from './config';
import jspm from 'jspm';

const System = new jspm.Loader();

function createFetcher(baseRequest) {
	return {
		fetchJson(url, { method, headers, body } = {}) {
			return new Promise(function(accept, reject) {
				baseRequest(
					{ url: url, method: method || 'GET', headers: headers, body: body },
					function(error, response, body) {
						return error ? reject(error) : accept(body);
					});
			});
		},
	};
}

function fetchUnsupported() {
	return Promise.reject(new Error('This client is unsupported on the server.'));
}

export function createClientFactoryAsync({ consumerToken, consumerSecret }) {
	return Promise.all([
		System.import('src/app/shared/clients/accounts'),
		System.import('src/app/shared/clients/auth') ])
		.then(function([{ createAccountsClient }, { createAuthClient }]) {
			return function createClients({ auth: { oauthToken, oauthSecret }}) {
				const oauth = {
					consumer_key: consumerToken,
					consumer_secret: consumerSecret,
					token: oauthToken,
					token_secret: oauthSecret,
				};

				return {
					accountsClient: createAccountsClient(createFetcher(request.defaults({
						baseUrl: config.baseUrls.accounts,
						oauth: oauth,
						json: true,
					}))),
					authClient: createAuthClient(fetchUnsupported),
				};
			};
		});
}
