const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StadiumSchema = new Schema({
	// match_id: String,
	staduim_id: String,
	name_slot:String,
	Position:String,
	SizePeople:Number,
	Islight:Number,
    Status:Number,
    TimeBusy:Date,
    stylefoot:Number,
    coverTop:Number,
    width:Number,
    height:Number,    

});

const stadiums = mongoose.model('Stadium', StadiumSchema, 'Stadium');

module.exports = stadiums;
