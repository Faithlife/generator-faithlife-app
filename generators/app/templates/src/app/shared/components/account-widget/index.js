import React from 'react';

export class AccountWidget extends React.Component {
	static propTypes = {
		user: React.PropTypes.object.isRequired,
		handleSignOut: React.PropTypes.func.isRequired,
	}

	render() {
		const user = this.props.user;

		if (user.id === '-1') {
			return (
				<div><a href="/auth/signin">Sign in</a></div>
			);
		}

		return (
			<div>
				<span>{user.alias || user.name}</span>
				<button onClick={() => this.props.handleSignOut()}>Sign out</button>
			</div>
		);
	}
}
