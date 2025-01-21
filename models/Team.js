const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
	// match_id: String,
	country_id: String,
	district_id:String,
	province_id:String,
	village_id:String,
	address:String,
    city_id :String,    
    nameTeam:String,
    status:String,
    // OwnName:String,
    slotNumber:Number,
    // user_id:Number,
    createDate:Date,
    type:String
    // match_id : [{ type: Schema.Types.ObjectId, ref: 'Match' }]
});

const teams = mongoose.model('StaTeamdium', TeamSchema, 'Team');

module.exports = teams;
