import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { App } from './views/app/index';
import { Home } from './views/home/index';

export const routes = (
	<Route component={App} path="/">
		<IndexRoute component={Home} />
	</Route>
);
