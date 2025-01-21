const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({	
	country_name: String,    
    status:Number,
});

const Countrys = mongoose.model('Country', CountrySchema, 'Country');

module.exports = Countrys;
 