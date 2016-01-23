import { getCurrentUserTypes, signOutTypes } from '../actions/action-types';

const actionHandlers = {
	[getCurrentUserTypes.success]: function setCurrentUser(state, { result }) {
		return { ...state, isProcessing: false, user: result, error: null };
	},
	[signOutTypes.success]: function clearCurrentUser(state) {
		return { ...state, isProcessing: false, user: defaultUser, error: null };
	},
};

export function auth(state = { user: defaultUser, isProcessing: false, error: null }, action) {
	const handler = actionHandlers[action.type];
	if (!handler) {
		return state;
	}

	return handler(state, action);
}

const defaultUser = {
	accountType: 'user',
	id: '-1',
	userType: { value: 'User' },
};
