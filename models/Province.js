const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProvinceSchema = new Schema({	
	Province_name: String,
    country_id: Number,
    city_id: Number,
    status:Number,
});

const Provinces = mongoose.model('Provinces', ProvinceSchema, 'Provinces');

module.exports = Provinces;
 