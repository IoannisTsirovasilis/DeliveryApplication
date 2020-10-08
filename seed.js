const config = require('config')
const connectionString = config.get('db.connectionString') + config.get('db.database');

module.exports = {
	"undefined": connectionString,
	"dev": connectionString,
	"prod": connectionString
}