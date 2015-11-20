import { getCurrentUserTypes, signOutTypes } from '../actions/action-types';

export function auth(state = { user: defaultUser, isProcessing: false }, action) {
	let { type, result } = action;

	switch (type) {
	case getCurrentUserTypes.success:
		return Object.assign({}, state, { isProcessing: false, user: result, error: null });

	case signOutTypes.success:
		return { isProcessing: false, user: defaultUser, error: null };

	default:
		return state;
	}
}

const defaultUser = {
	accountType: 'user',
	id: '-1',
	userType: { value: 'User' },
};
