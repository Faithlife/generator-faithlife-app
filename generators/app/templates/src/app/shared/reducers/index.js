import { combineReducers } from 'redux';
import * as authReducers from './auth-reducers';

export const rootReducer = combineReducers({
	...authReducers,
});
