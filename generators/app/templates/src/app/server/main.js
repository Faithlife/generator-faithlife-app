import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RoutingContext } from 'react-router';

import { Html } from './html';
import { activate } from '../shared/activator';
import { routes } from '../shared/routes';
import { configureStore } from '../shared/configure-store';
import { getViewRoot } from '../shared/root';

const isDebug = !!process.env.DEVTOOLS;

export function createAppRequestHandler() {
	return function handleAppRequest(request, response) {
		const store = configureStore({}, request.clients);

		function render(status, renderProps) {
			const content = ReactDOMServer.renderToString(
				<Html isDebug={isDebug} store={store}>
					{getViewRoot((<RoutingContext {...renderProps} />), store, isDebug)}
				</Html>
			);

			response.status(status).send('<!doctype html>' + content);
		}

		match({ routes, location: request.url }, (error, redirectLocation, renderProps) => {
			if (error) {
				console.error(error.stack || error);
				render(500);
			} else if (redirectLocation) {
				response.redirect(302, redirectLocation.pathname + redirectLocation.search);
			} else if (renderProps) {
				let replacementState;
				renderProps.history.listen(function(state, routerState) {
					replacementState = routerState;
				});
				replacementState = null;

				activate(renderProps, [ store, renderProps, renderProps.history.pushState ])
					.then(() => {
						if (replacementState && (replacementState.location.pathname !== renderProps.location.pathname || replacementState.location.search !== renderProps.location.search)) {
							response.redirect(302, replacementState.location.pathname + replacementState.location.search);
						} else {
							render(200, renderProps);
						}
					})
					.catch((error) => {
						console.error(error.stack || error);
						return render(500);
					})
					.catch((error) => {
						console.error(`Error: ${error.stack}`);
						response.status(500).send('Error');
					});
			} else {
				response.status(404).send('Not found');
			}
		});
	};
}
