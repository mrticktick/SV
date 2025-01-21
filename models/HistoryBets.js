const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
	name: String,
	type_customer: String,
	bets_rechange: Number,
    createdate_rechange: Date,
});

const Products = mongoose.model('Products', productsSchema, 'Products');

module.exports = Products;
