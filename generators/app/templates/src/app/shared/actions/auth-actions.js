import { getCurrentUserTypes, signOutTypes } from './action-types';

export function getCurrentUser() {
	return {
		types: getCurrentUserTypes,
		promise: ({ accountsClient }) => accountsClient.getCurrentUser(),
	};
}

export function getCurrentUserIfNecessary() {
	return (dispatch, getState) => {
		let { auth } = getState();

		if (auth.isProcessing || auth.isLoaded) {
			return Promise.resolve({ result: auth.user, type: getCurrentUserTypes.success });
		}

		return dispatch(getCurrentUser());
	};
}

export function signOut() {
	return {
		types: signOutTypes,
		promise: ({ authClient }) => authClient.signOut(),
	};
}
