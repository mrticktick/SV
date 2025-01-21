const express = require('express');
const router = express.Router();

router.get('/getAllProduct', (req, res) => {
	Product.find()
		.then(product => {
			res.status(201).send({
				success: true,
				message: product
			});
		})
		.catch(err => {
			return errors.errorHandler(res, err);
		});
});