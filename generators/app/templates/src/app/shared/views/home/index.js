import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { AccountWidget } from '../account-widget/index';

function mapStateToProps(state) {
	return state;
}

@connect(mapStateToProps)
export class Home extends React.Component {
	render() {
		return (
			<div>
				<Helmet title="Home" />
				<AccountWidget />
			</div>
		);
	}
}
