const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitSchema = new Schema({
	block_name: String,
	floor_number: String,
	unit_number: String
	
});

const Unit = mongoose.model('Uint', UnitSchema, 'Uint');

module.exports = Unit;
