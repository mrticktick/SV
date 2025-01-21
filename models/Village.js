const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VillageSchema = new Schema({	
    village_name: String,
    province_id: Number,
	district_id: Number,
    country_id: Number,
    city_id: Number,
    status:Number,
});

const Villages = mongoose.model('Village', VillageSchema, 'Village');

module.exports = Villages;
 