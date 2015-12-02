import 'whatwg-fetch';

export function createFetcher({ baseUrl }) {
	return function fetchJson(input, { method, headers, body } = {}) {
		const init = {
			method: method || 'GET',
			headers: headers,
			body: body,
			credentials: 'same-origin',
		};

		const request = new Request(baseUrl + input, init);
		request.headers.append('x-requested-with', 'fetch');

		return fetch(request)
			.then(rejectOnError)
			.then(response => response.json());
	};
}

export function rejectOnError(response) {
	if (!response.ok) {
		const error = new Error('Unexpected server response.');
		return response.json()
			.catch(() => {
				throw error;
			})
			.then(serverResponse => {
				error.serverResponse = serverResponse;
				throw error;
			});
	}

	return response;
}
