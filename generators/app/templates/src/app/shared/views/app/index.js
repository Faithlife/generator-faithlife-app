import React from 'react';
import { connect } from 'react-redux';
import { getCurrentUserIfNecessary } from '../../actions/index';

function mapStateToProps(state) {
	return state;
}

@connect(mapStateToProps)
export class App extends React.Component {
	static propTypes = {
		children: React.PropTypes.node,
	}

	static activate(store) {
		return store.dispatch(getCurrentUserIfNecessary());
	}

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}
