import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';

export class Html extends React.Component {
	static propTypes = {
		store: React.PropTypes.object.isRequired,
		children: React.PropTypes.node.isRequired,
	}

	render() {
		const { store, children } = this.props;
		const content = ReactDOMServer.renderToString(children);
		let head = Helmet.rewind();

		return (
			<html lang="en">
				<head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
					{head.meta.toComponent()}
					{head.title.toComponent()}
					<link rel="shortcut icon" href="/public/images/favicon.ico" />
					<link rel="stylesheet" type="text/css" href="/dist/style.css" />
				</head>
				<body>
					<div id="app" dangerouslySetInnerHTML={{ __html: content }} />
					<script dangerouslySetInnerHTML={{ __html: `var __INITIAL_STATE__ = ${JSON.stringify(store.getState())};` }} />
					<script src="/dist/main.bundle.js" />
				</body>
			</html>
		);
	}
}
