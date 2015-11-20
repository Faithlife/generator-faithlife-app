import { createFetcher } from './helpers';
import { createAccountsClient } from '../../shared/clients/accounts';
import { createAuthClient } from '../../shared/clients/auth';

export const accountsClient = createAccountsClient({
	fetchJson: createFetcher({ baseUrl: '/api/accounts/' }),
});

export const authClient = createAuthClient({
	fetchJson: createFetcher({ baseUrl: '/auth/' }),
});
