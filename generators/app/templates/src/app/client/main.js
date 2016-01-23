import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import { configureStore } from '../shared/configure-store';
import { routes } from '../shared/routes';
import { activate } from '../shared/activator';
import { getViewRoot } from '../shared/root';
import * as clients from './http';

const storeConfigs = [];

const store = configureStore(window.__INITIAL_STATE__ || {}, clients, storeConfigs);

const view = (
	<Router
		routes={routes}
		history={createBrowserHistory()}
		onUpdate={handleRouterUpdate} />
	);

ReactDOM.render(getViewRoot(view, store), document.getElementById('app'));

function handleRouterUpdate() {
	const state = this.state;
	activate(state, [ store, state, this.history.push ]);
}
