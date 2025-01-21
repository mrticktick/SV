const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DistrictSchema = new Schema({	
	district_name: String,
    country_id: Number,
    city_id: Number,
    province_id:Number,
    status:Number,
});

const Districts = mongoose.model('District', DistrictSchema, 'District');

module.exports = Districts;
 