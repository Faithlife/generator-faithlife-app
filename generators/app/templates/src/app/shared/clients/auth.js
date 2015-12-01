export function createAuthClient({ fetchJson }) {
	return {
		signOut() {
			return fetchJson('signout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
		},
	};
}
