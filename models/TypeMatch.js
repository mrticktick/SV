const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typematchsSchema = new Schema({
	// match_id: String,
	match_id: String,
    nametype:String,
    estimateTime:Date
      
	
});

const typesmatchs = mongoose.model('TypeMatch', typematchsSchema, 'TypeMatch');

module.exports = typesmatchs;
