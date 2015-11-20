import React from 'react';
import { connect } from 'react-redux';
import { signOut } from '../../actions/index';

function mapStateToProps({ auth }) {
	return { auth };
}

@connect(mapStateToProps)
export class AccountWidget extends React.Component {
	static propTypes = {
		auth: React.PropTypes.object.isRequired,
		dispatch: React.PropTypes.func.isRequired,
	}

	handleSignOut() {
		if (!this.props.auth.isProcessing) {
			this.props.dispatch(signOut());
		}
	}

	render() {
		const user = this.props.auth.user;

		if (user.id === '-1') {
			return (
				<div><a href="/auth/signin">Sign in</a></div>
			);
		}

		return (
			<div>
				<span>{user.alias || user.name}</span>
				<button onClick={() => this.handleSignOut()}>Sign out</button>
			</div>
		);
	}
}
