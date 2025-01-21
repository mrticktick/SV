const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StadiumSchema = new Schema({
	// match_id: String,
	country_id: String,
	district_id:String,
	province_id:String,
	village_id:String,
	address:String,
    city_id :String,    
    nameStadium:String,
    status:String,
    // OwnName:String,
    slotNumber:Number,
    user_id:Number,
    date:Date,
    type:String,
    match_id : [{ type: Schema.Types.ObjectId, ref: 'Match' }]
});

const stadiums = mongoose.model('Stadium', StadiumSchema, 'Stadium');

module.exports = stadiums;
