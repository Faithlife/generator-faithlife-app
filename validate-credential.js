var expression = /^[A-Fa-f0-9]{40}$/;

exports.isValidOAuthCredential = function isValidOAuthCredential(input) {
	return expression.exec(input) !== null;
}