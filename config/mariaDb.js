// const mongoose = require('mongoose');
// const chalk = require('chalk');

// module.exports = {
// 	connectToServer: function (callback) {
// 		var mongoDB = process.env.MONGODB_URI;
// 		mongoose.Promise = global.Promise;
// 		mongoose.connect(mongoDB);
// 		mongoose.connection.on(
// 			'error',
// 			console.error.bind(
// 				console,
// 				'%s MongoDB connection error. Please make sure MongoDB is running.',
// 				chalk.red('✗')
// 			)
// 		);
// 		return callback();
// 	}
// };


//-------------------------
// connect mariaDb
const { log } = require('chalk-console');
const mariadb = require('mariadb');

// Create a connection pool 
const pool = mariadb.createPool({
	host: "localhost",
	user: 'root',
	password: '111',
	database: 'FreeAndEnjoy',
	port: "3307",
	connectionLimit: 5
});

module.exports = {
	connectToServer: function (callback) {
		var mariadDB = process.env.MARIADB_URI;
		console.log(mariadDB);

		pool.getConnection().then(conn => {
			console.log("Connected");
			return conn;
		}).catch(err => {
			callback(err); // Return error if connection fails
			// mariadb.Promise = global.Promise;
			// mariadb.connect(mongoDB);
			// mariadb.connection.on(
			// 	'error',
			// 	console.error.bind(
			// 		console,
			// 		'%s MongoDB connection error. Please make sure MongoDB is running.',
			// 		chalk.red('✗')
			// 	)
			// );

		});
	}
}