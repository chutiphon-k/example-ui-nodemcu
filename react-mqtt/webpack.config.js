const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry : './resources/assets/js/index.js',
	output : {
		publicPath : './resources/builds/',
		path : path.join(__dirname, '/resources/builds'),
		filename : 'bundle.js'
	},
	module : {
		loaders : [
			{
				test : /\.jsx?/,
				exclude : '/nodule_modules/',
				loaders : [
					'babel-loader'
				]
			}
		]
	}
}