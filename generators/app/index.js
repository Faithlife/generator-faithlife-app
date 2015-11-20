'use strict';
var yeoman = require('yeoman-generator');
var glob = require('glob');
var path = require('path');

var isValidOAuthCredential = (function() {
	var expression = /^[A-Fa-f0-9]{40}$/;
	return function isValidOAuthCredential(input) {
		return expression.exec(input) !== null;
	}
})();

module.exports = yeoman.generators.Base.extend({
	prompting: function prompting() {
		var self = this;
		var done = this.async();

		var prompts = [
			{
				type: 'input',
				name: 'name',
				message: 'Your project name',
				default: self.appname,
			},
			{
				type: 'input',
				name: 'title',
				message: 'Application title',
				default: function(props) { return props.name; },
			},
			{
				type: 'input',
				name: 'description',
				message: 'Description',
			},
			{
				type: 'input',
				name: 'author',
				message: 'Author',
			},
			{
				type: 'input',
				name: 'consumerToken',
				message: 'OAuth credentials can be created at https://developer.faithlife.com/applications/registered\nOAuth consumer token',
				validate: isValidOAuthCredential,
			},
			{
				type: 'input',
				name: 'consumerSecret',
				message: 'OAuth consumer secret',
				validate: isValidOAuthCredential,
			}];

		self.prompt(prompts, function (props) {
			self.props = props;
			done();
		});
	},

	_findTemplatesAsync: function findTemplatesAsync(pattern) {
		var sourceRoot = this.sourceRoot();
		return new Promise(function (accept, reject) {
			glob(pattern, { cwd: sourceRoot }, function(error, files) {
				return error ? reject(error) : accept(files);
			});
		});
	},

	writing: function writing() {
		var self = this;
		var done = self.async();

		self.fs.write(
			self.destinationPath('.gitignore'),
			[
				'# Temp files',
				'.DS_Store',
				'# Logs',
				'logs',
				'*.log',
				'# Runtime data',
				'pids',
				'*.pid',
				'*.seed',
				'# Dependencies',
				'node_modules',
				'jspm_packages',
				'# Config values',
				'src/server/environments',
			].join('\n'))

		Promise.all([
			self._findTemplatesAsync('**/*.{js,json}'),
			self._findTemplatesAsync('**/*.template'),
		]).then(function(promiseResults) {
			promiseResults[0].forEach(function(file) {
				self.fs.copy(self.templatePath(file), self.destinationPath(file));
			});

			promiseResults[1].forEach(function(file) {
				self.fs.copyTpl(
					self.templatePath(file),
					self.destinationPath(path.join(path.dirname(file), path.basename(file, '.template'))),
					self.props);
			});

			done();
		}).catch(function(error) {
			throw error;
		});
	},

	install: function install() {
		this.npmInstall();
		this.runInstall('jspm');
	}
});
