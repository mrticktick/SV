const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchsSchema = new Schema({
	// match_id: String,
	match_title: String,
	match_description: String,
	country_id: String,
	district_id:String,
	province_id:String,
	village_id:String,
	address:String,
	city_id :String,
	country_name: String,
	league_id: String,
	league_name: String,
	match_date: Date,
	match_status: String,
	match_start : String,
	hometeam_id:Number,
	awayteam_id:Number,
	match_hometeam_name : String,
	estimate_time:Date,
	match_end:Date,
	type:String,
	// stadium_id:String,
    
    match_hometeam_score: String,
	match_awayteam_name: String,
	match_awayteam_score: String,
	match_hometeam_halftime_score: String,
	match_awayteam_halftime_score: String,
	match_hometeam_extra_score : String,
    match_awayteam_extra_score : String,

    match_hometeam_penalty_score: String,
	match_awayteam_penalty_score: String,
	match_hometeam_system: String,
	match_awayteam_system: String,
	match_live: String,
	goalscorer: Array,
	cards: Array,
	lineup: Object,
	stadium_id : { type: Schema.Types.ObjectId, ref: 'Stadium' },
});

const matchs = mongoose.model('Match', matchsSchema, 'Match');

module.exports = matchs;
