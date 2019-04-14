const configValues = require('./config');

module.exports = {

	getDbConnectionStrings: function() {
		return 'mongodb://' + configValues.DB_username + ':' + configValues.DB_password + '@ds115595.mlab.com:15595/kpmg-marketplace';
	}

};