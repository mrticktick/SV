const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
	MatchId: String,
	type: String,
	supplier: String,
	code: String,
	createdate: Date,
	start_time : String,
	end_time : String
});

const Products = mongoose.model('Products', productsSchema, 'Products');

module.exports = Products;
