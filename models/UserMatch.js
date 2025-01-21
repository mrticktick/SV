const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserMatchSchema = new Schema({
	email: String,
	matchId: String,
	bets: String,
	status: Boolean,//win or failed
	createdate: Date,
	start_time_es: String,
	end_time_es : String,
	effect: Number,//1 ok,2 not,3 something
});

const UserMatch = mongoose.model('UserMatch', UserMatchSchema, 'UserMatch');

module.exports = UserMatch;
