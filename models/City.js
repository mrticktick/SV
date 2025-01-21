const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  CitySchema = new Schema({	
    country_id:Number,
    city_name: String,
    status:Number,
});

const Citys = mongoose.model('City', CitySchema, 'City');

module.exports = Citys;
 