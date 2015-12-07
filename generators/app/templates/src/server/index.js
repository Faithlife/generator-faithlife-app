import express from 'express';
import sessions from 'client-sessions';
import { createAuthApp } from './auth';
import config from './config';
import { createClientFactory } from './clients';
import { createProxy } from './proxy';
import * as main from '../app/server/main';
import { addWebpackDevProxy } from './dev';

const app = express();
const port = process.env.PORT || 3000;

// Allow connecting to self-signed environments.
if (!PRODUCTION) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
}

app.use('/dist', express.static('dist'));

if (DEBUG) {
	addWebpackDevProxy(app);
}

app.get('/up', function(request, response) {
	response.status(204).send();
});

app.use(sessions({
	cookieName: 'auth',
	duration: 1000 * 60 * 60 * 24 * 365 * 10,
	secure: PRODUCTION,
	httpOnly: true,
	ephemeral: false,
	secret: config.session.secret,
}));

let createClients = createClientFactory(config.oauthCredentials);
app.use(function(request, response, next) {
	request.clients = createClients(request);
	next();
});

const authApp = createAuthApp({
	useHttpsCallback: PRODUCTION,
	baseUrl: config.baseUrls.auth,
	oauthCredentials: config.oauthCredentials,
	getAccountsClient: function(request) { return request.clients.accountsClient; },
	getSession: function(request) {
		const auth = request.auth;
		return {
			getValue(key) {
				return auth[key];
			},
			setValue(key, value) {
				auth[key] = value;
				request.clients = createClients(request);
			},
			deleteValue(key) {
				delete auth[key];
				request.clients = createClients(request);
			},
		};
	},
});

app.use('/auth', authApp);

app.use('/api/accounts', createProxy({
	baseUrl: config.baseUrls.accounts,
	oauthCredentials: config.oauthCredentials,
	getCurrentUserCredentials: authApp.getCurrentUserCredentials,
}));

app.use(main.createAppRequestHandler());

app.use(function(error, request, response) {
	console.error(error.stack);
	response.status(500).send(DEBUG ? `<pre>${error.stack}</pre>` : 'Internal Server Error');
});

app.listen(port, function() {
	console.log('Server running on port ' + port);
});
