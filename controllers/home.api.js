const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
// const Product = require('../models/Products');
const Products = require('../models/Products');
const Matchs = require('../models/Matchs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('./auth');
const config = require('../config/auth.js');
const errors = require('./error');


router.use((req, res, next) => {
	// var token = req.headers['authorization'];

	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	if (!token) {

		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});
	//	return next();
	}

	token = token.replace('Bearer ', '');
	jwt.verify(token, config.secret, (err, user) => {
		if (err) {
			//attempt to refresh token here... if successful, next(). Maybe won't work as we'd need the refresh token on every request?
			return errors.errorHandler(
				res,
				'Your access token is invalid.',
				'invalidToken'
			);
		} else {
			req.user = user;
			next();
		}
	});
});

// router.get('/', (req, res) => {	
//     // console.log("homehoemhoem111    :"+req.query.per_page);
// 	// console.log("homehoemhoem222    :"+req.query.page);
// 	let per_page = parseInt(req.query.per_page); 
// 	let page = req.query.page;
// 	Product.find().skip((per_page * page) - per_page).limit(per_page)
// 		.then(product => {
// 			res.status(201).send({
// 				//success: true,
// 				message: product
// 			});
// 		})
// 		.catch(err => {
// 			return errors.errorHandler(res, err);
// 		});
// });

router.get('/', (req, res) => {	
    // console.log("homehoemhoem111    :"+req.query.per_page);
	// console.log("homehoemhoem222    :"+req.query.page);
	let per_page = parseInt(req.query.per_page); 
	let page = req.query.page;
	Products.find().skip((per_page * page) - per_page).limit(per_page)
		.then(product => {
				//match
				Matchs.find().skip((per_page * page) - per_page).limit(per_page)
						.then(match => {
					res.status(201).send({
					//	success: true,
					//	message: match,
						events: {"data": product},	
						matchs : {"data": match}
					});
				})
		})
		.catch(err => {
			return errors.errorHandler(res, err);
		});
});

router.get('/', (req, res) => {	
		
});

module.exports = router;