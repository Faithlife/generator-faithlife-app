import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';

export class Html extends React.Component {
	static propTypes = {
		isDebug: React.PropTypes.bool.isRequired,
		store: React.PropTypes.object.isRequired,
		children: React.PropTypes.node.isRequired,
	}

	render() {
		const { isDebug, store, children } = this.props;
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
				</head>
				<body>
					<div id="app" dangerouslySetInnerHTML={{ __html: content }} />
					<script dangerouslySetInnerHTML={{ __html: `var __INITIAL_STATE__ = ${JSON.stringify(store.getState())}, __DEBUG__ = ${isDebug};` }} />
					{renderScripts()}
				</body>
			</html>
		);
	}
}

function renderScripts() {
	if (!DEBUG) {
		return [ <script key="bundle" src="/dist/main.bundle.js" /> ];
	}

	return [
		<script key="system" src="/jspm_packages/system.js" />,
		<script key="config" src="/config.js" />,
		<script key="bootstrap" dangerouslySetInnerHTML={{ __html: "System.import('/app/client/main.js').catch(function (error) { console.log(error); });" }} />,
	];
}
