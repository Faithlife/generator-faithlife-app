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
		if (!auth.user.isLoaded && !auth.isProcessing) {
			return dispatch(getCurrentUser());
		}
	};
}

export function signOut() {
	return {
		types: signOutTypes,
		promise: ({ authClient }) => authClient.signOut(),
	};
}
