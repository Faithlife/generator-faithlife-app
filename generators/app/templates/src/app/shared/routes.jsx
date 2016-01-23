import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { App } from './pages/app';
import { Home } from './pages/home';

export const routes = (
	<Route component={App} path="/">
		<IndexRoute component={Home} />
	</Route>
);
