import React from 'react';
import { connect } from 'react-redux';
import { getCurrentUserIfNecessary } from '../../actions/index';

export class App extends React.Component {
	static propTypes = {
		children: React.PropTypes.node,
	}

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}
