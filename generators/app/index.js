'use strict';
var yeoman = require('yeoman-generator');
var glob = require('glob');
var path = require('path');
var isValidOAuthCredential = require('../../validate-credential').isValidOAuthCredential;

var options = [
	{
		name: 'name',
		desc: 'Project name',
		message: 'Your project name',
		defaultGenerator: function(self) { return self.appname; },
	},
	{
		name: 'title',
		desc: 'Application title',
		message: 'Application title',
		defaultGenerator: function(self) { return function(props) { return props.name; } },
	},
	{
		name: 'description',
		desc: 'Package description',
		message: 'Description',
	},
	{
		name: 'author',
		desc: 'Package author',
		message: 'Author',
	},
	{
		name: 'consumerToken',
		desc: 'OAuth consumer token',
		message: 'OAuth credentials can be created at https://developer.faithlife.com/applications/registered\nOAuth consumer token',
		validate: isValidOAuthCredential,
	},
	{
		name: 'consumerSecret',
		desc: 'OAuth consumer secret',
		message: 'OAuth consumer secret',
		validate: isValidOAuthCredential,
	}];

module.exports = yeoman.generators.Base.extend({
	constructor: function() {
		var self = this;
		yeoman.generators.Base.apply(self, arguments);

		options.forEach(function(option) {
			self.option(option.name, { desc: option.desc, type: 'String' });
		});
	},

	prompting: function prompting() {
		var self = this;
		var done = this.async();

		var prompts = options
			.filter(function (option) { return self.options[option.name] === undefined; })
			.map(function (option) {
				return {
					type: 'input',
					name: option.name,
					message: option.message,
					default: option.defaultGenerator ? option.defaultGenerator(self) : null,
					validate: option.validate,
				};
			});

		self.prompt(prompts, function (props) {
			self.props = props;
			done();
		});
	},

	_findSourceFilesAsync: function findSourceFilesAsync() {
		var sourceRoot = this.sourceRoot();
		return new Promise(function (accept, reject) {
			glob('**', { cwd: sourceRoot, dot: true, nodir: true }, function(error, files) {
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
				'# Config values',
				'src/server/environments',
				'# Bundled files',
				'dist',
			].join('\n'));

		self._findSourceFilesAsync()
			.then(function(files) {
				files.forEach(function(file) {
					if (file.match(/\.template$/)) {
						self.fs.copyTpl(
							self.templatePath(file),
							self.destinationPath(path.join(path.dirname(file), path.basename(file, '.template'))),
							self.props);
					} else {
						self.fs.copy(self.templatePath(file), self.destinationPath(file));
					}
				});

			done();
		}).catch(function(error) {
			throw error;
		});
	},

	install: function install() {
		this.npmInstall();
	}
});
