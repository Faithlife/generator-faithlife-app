import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { AccountWidget } from '../../components/account-widget';
import { signOut, getCurrentUserIfNecessary } from '../../actions';

function mapStateToProps({ auth }) {
	return { auth };
}

@connect(mapStateToProps)
export class Home extends React.Component {
	static propTypes = {
		auth: React.PropTypes.object.isRequired,
		dispatch: React.PropTypes.func.isRequired,
	}

	static activate(store) {
		return store.dispatch(getCurrentUserIfNecessary());
	}

	handleSignOut() {
		if (!this.props.auth.isProcessing) {
			this.props.dispatch(signOut());
		}
	}

	render() {
		return (
			<div>
				<Helmet title="Home" />
				<AccountWidget user={this.props.auth.user} handleSignOut={() => this.handleSignOut()} />
			</div>
		);
	}
}
