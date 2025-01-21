const express = require('express');
const router = express.Router();
const Product = require('../models/UserMatch');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('./auth');
const config = require('../config/auth.js');
const errors = require('./error');
var multer  = require('multer')
// const { p	arse } = require('querystring');
var upload = multer()

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


router.post(
	'/AddUserMatch',
//	auth.validateRefreshToken,
	(req, res, next) => {
		if (!req.body.name ) {
			return errors.errorHandler(
				res,
				'You must send the Match name.'
			);
		}
		Product.find({ name: req.body.name })
			.then(product => {
				if (product.length > 0) {
					return errors.errorHandler(
						res,
						'A Match with that Name already exists.'
					);
				}
				// --- unit
			//	let newVisitors = _.pick(req.body, 'Status');
				// ---

				let createdate = Date();
				console.log("ngay        :"  + req.body.date);
			//	let passwordHash = bcrypt.hashSync(req.body.password.trim(), 12);
				let newProduct = _.pick(req.body, 'name', 'type','address', 'supplier','code','createdate','title','start_time','end_time','date','description',
				'facility_instance','rsvp_link','visitors');
				//newProduct.visitors = newVisitors
				//newUser.password = passwordHash;
				return Product.create(newProduct);
			})
			.then(newProduct => {
				req.Product = newProduct;
				res.status(201).send({
					success: true,
					message: newProduct
				});
				next();
			})
			.catch(err => {
				return errors.errorHandler(res, err);
			});
	},
	// (req, res) => {
	// 	res.status(201).send({
	// 		success: true,
	// 		message: newProduct
	// 	});
	// }

	// auth.createToken,
	// auth.createRefreshToken,
	// (req, res) => {
	// 	res.status(201).send({
	// 		success: true,
	// 		authToken: req.authToken,
	// 		refreshToken: req.refreshToken
	// 	});
	// }
);


router.get('/getAllUserMatch', (req, res) => {
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

router.put('/UpdateUserMatch', (req, res, next) => {

	if (!req.body.name ) {
		return errors.errorHandler(
			res,
			'You must send the Match name.'
		);
	}
	else{
			
		Product.findOneAndUpdate(
			{ 
				name: req.body.name,
				
			},
			{$set:{type:req.body.type}},function(err, doc){
				if(err){
					console.log("Something wrong when updating data!");
				}
			
				console.log(doc);
			});
	
		// )
		// 	.then(() => {
		// 		next();
		// 	})
		// 	.catch(err => {
		// 		return errors.errorHandler(res, err);
		// 	});
	}
		res.status(201).send({
			success: true,
			//message: product
		});
});

router.post('/DeleteUserMatch', (req, res, next) => {

	if (!req.body.name ) {
		return errors.errorHandler(
			res,
			'You must send the Product name.'
		);
	}
	else{
			//console.log("type     :" + req.body.type);
		Product.findOneAndRemove(
			{ name: req.body.name },function(err, doc){
		//	{$set:{type:req.body.type}},function(err, doc){
				if(err){
					console.log("Something wrong when updating data!");
				}
			
				console.log(doc);
			});
	
		// )
		// 	.then(() => {
		// 		next();
		// 	})
		// 	.catch(err => {
		// 		return errors.errorHandler(res, err);
		// 	});
	}
		res.status(201).send({
			success: true,
			//message: product
		});
});

//getmatchdetail
router.get('/:id', (req, res) => {
	console.log('getttt match   :'+req.params.id);
	Product.find({
		_id: req.params.id,

	})
		.then(product => {
			res.status(201).send({
				success: true,
				message: product,				
				rsvp_deadline: product[0].date,
				facility_instance : product[0].facility_instance,
				visitors: product[0].visitors,
				description: product[0].description,
				rsvp_link: product[0].rsvp_link,
				address: product[0].address,
			});
		})
		.catch(err => {
			return errors.errorHandler(res, err);
		});
});

// updata MAtch detail
router.put('/:id', upload.array(), (req, res) => {
	let formData = req.body;

	if (!req.params.id) {
		return errors.errorHandler(
			res,
			'You must send the Match.'
		);
	}
	else{
	Product.findOneAndUpdate(
		{ 
			_id: req.params.id,		
		},
		{
			$set:{
				description: formData.condo_event_description,
				title: formData.condo_event_title,
				date: formData.condo_event_rsvp_deadline,

			}
		},function(err, doc)
		{
			if(err){
				console.log("Something wrong when updating data!");
			}
		
			console.log(doc);
		})	
	}
		res.status(201).send({
			success: true,
			
		});	
	
});


module.exports = router;
