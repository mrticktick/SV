const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
	name: String,
	telephone: String,
	email: String,
	password: String,
	refreshToken: String,
	avatar_url : String,
	language : String,
	condo_unit : Object,
	wallet: Number,
	address:String,
	village_id: String,
    province_id: Number,
	district_id: Number,
	country_id: Number,   
	team_id : { type: Schema.Types.ObjectId, ref: 'Team' }
});

const Users = mongoose.model('Users', usersSchema, 'Users');

module.exports = Users;
