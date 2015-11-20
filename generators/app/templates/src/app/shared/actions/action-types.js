export const getCurrentUserTypes = createAsyncActionTypes('GET_CURRENT_USER');
export const signOutTypes = createAsyncActionTypes('SIGN_OUT');

function createAsyncActionTypes(processing, success = `${processing}_SUCCESS`, error = `${processing}_ERROR`) {
	return { processing, success, error };
}
