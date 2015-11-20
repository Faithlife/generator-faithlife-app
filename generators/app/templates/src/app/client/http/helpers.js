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
		throw response;
	}

	return response;
}
