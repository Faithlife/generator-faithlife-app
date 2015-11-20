import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers/index';

export function configureStore(initialState, middlewareApi, storeConfig = []) {
	let createStoreWithMiddleware = compose(
		applyMiddleware(
			thunkMiddleware,
			createCancelWhenRunningMiddleware(),
			createPromiseMiddleware(middlewareApi)
		),
		...storeConfig
	)(createStore);

	return createStoreWithMiddleware(rootReducer, initialState);
}

function createPromiseMiddleware(...callbackArgs) {
	return function promiseMiddleware() {
		return next => action => {
			let { promise, canCancel, types, ...rest } = action;
			if (!promise) {
				return next(action);
			}

			next({ ...rest, type: types.processing });

			let cancel;
			let cancelPromise = new Promise((resolve, reject) => {
				cancel = reject;
			});

			let wrapped = Promise.race([ cancelPromise, Promise.resolve()
				.then(() => {
					if (typeof promise === 'function') {
						return promise(...callbackArgs);
					}

					return promise;
				}) ])
				.then(
					result => next({ ...rest, result, type: types.success }),
					error => {
						if (error !== 'canceled') {
							return Promise.reject(next({ ...rest, error, type: types.error }));
						}
					}
				);

			if (canCancel) {
				wrapped.cancel = () => cancel('canceled');
			}

			return wrapped;
		};
	};
}

function createCancelWhenRunningMiddleware() {
	let runningActions = {};

	return function cancelWhenRunningMiddleware() {
		return next => action => {
			let group = action.cancellationGroup;

			if (!group) {
				return next(action);
			}

			if (!action.canCancel) {
				throw new Error('Actions must be cancelable to use cancellation groups');
			}

			let runningAction = runningActions[group];
			if (runningAction) {
				runningAction.cancel();
			}

			let currentAction = next(action);
			runningActions[group] = currentAction;

			let remove = () => {
				if (runningActions[group] === currentAction) {
					runningActions[group] = null;
				}
			};

			return currentAction.then(remove, remove);
		};
	};
}
