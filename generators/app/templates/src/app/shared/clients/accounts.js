export function createAccountsClient({ fetchJson }) {
	return {
		getAccount(accountId) {
			return fetchJson(`accounts/${encodeURIComponent(accountId)}`);
		},

		getCurrentUser() {
			return fetchJson('users/me');
		},
	};
}
