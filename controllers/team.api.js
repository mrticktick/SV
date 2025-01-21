const express = require('express');
const router = express.Router();
const Stadium = require('../models/Stadium');
const Team = require('../models/Team'); 
const _ = require('lodash');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const auth = require('./auth');
const config = require('../config/auth.js');
const errors = require('./error');
var multer  = require('multer')

// var ObjectId = require('mongodb').ObjectID
// const { p	arse } = require('querystring');
var upload = multer()

let remain = 0;


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
	'/AddStadium',
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
				//console.log("ngay        :"  + req.body.date);
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

);


router.get('/getAllStadium', (req, res) => {
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

router.put('/UpdateStadium', (req, res, next) => {

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

router.post('/DeleteStadium', (req, res, next) => {

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
	
	
	}
		res.status(201).send({
			success: true,
			//message: product
		});
});

//getmatchdetail
router.get('/:id', (req, res) => {
    console.log('go to here')
	// console.log('getttt match   :'+req.params.id);
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
	//let body = '';
	let formData = req.body;
	

 var data = {};
 if (formData.condo_event_rsvp_deadline){
	data.date = formData.condo_event_rsvp_deadline;
 }
 if (formData.condo_event_title) {
	data.title = formData.condo_event_title;
}
if (formData.condo_event_description) {
	data.description = formData.condo_event_description;
}
	if (!req.params.id) {
		return errors.errorHandler(
			res,
			'You must send the Match.'
		);
	}
	else{
		console.log('u[pppppppppppppppppppppppppppppdate')
	//	Product.findOneAndUpdate({_id:ObjectId(req.params.id)},setObj )
	Product.findOneAndUpdate(
		{ 
			_id: req.params.id,		
		},
		{
			
			$set:data
			
			//	description: formData.condo_event_description,
				//title: formData.condo_event_title,
				//date: formData.condo_event_rsvp_deadline,

			
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
			//message: product
		});	
	
});


router.get('/', (req, res,next) => {	
	
	try {
        console.log("hereeeeeeeeeeeeeee         :   "+req.query.team_id)
				var page = req.query.page;            
                // if(!req.query.memberId)
                // {
                //     return errors.errorHandler(
                //         res,
                //         'You must send the Match name.'
                //     );
                // }
                		
					Team.find()
					.skip((5* req.query.page) - 5).limit(5)
                        .then(user => 
                            {				
								// console.log('remain				:' + remain);
								if(remain <= 0)
								{
									remain = 0;
									console.log('111111111:					');
									res.status(201).send({
										success: true,							
										data: user || [],											
                                        meta: {paginate:({next_page:0},{currentPage:1})},
                                        
                                    //	currentPage: parseInt(req.query.page)	
                                    //currentPage: {paginate:({next_page:0})},			
									});
								}
								else
								{
									 remain = 0;
									console.log('2222222222222:				');
									res.status(201).send({
										success: true,						
										data: user || [],		
                                        meta: {paginate:({next_page:parseInt(req.query.page) + 1})},
                                        meta: {paginate:({currentPage:parseInt(req.query.page)})},
									//	currentPage: parseInt( req.query.page)		
									});
								}		
								remain = 0;				
											
							
						})

} catch (e) {
	next(e)
  }
			
});
module.exports = router;
