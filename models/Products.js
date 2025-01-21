const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
	name: String,
	type: String,
	supplier: String,
	code: String,
	createdate: Date,
	start_time : String,
	end_time : String,
	date : Date,
	title : String,
	facility_instance: String,
	visitors: Object,
	description: String,
	rsvp_link : String,
	address: String
	// data : Object
	//refreshToken: String
});

const Products = mongoose.model('Products', productsSchema, 'Products');

module.exports = Products;
