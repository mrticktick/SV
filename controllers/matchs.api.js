const express = require('express');
const router = express.Router();
const Match = require('../models/Matchs'); 
const _ = require('lodash');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const auth = require('./auth');
const config = require('../config/auth.js');
const errors = require('./error');
var multer  = require('multer')
let upload  = multer({ storage: multer.memoryStorage() });

//var upload = multer()


// ============================= global
var nextpageTotal = 0;
let first =  true;
let count = 0;
let resultdata = 0;
let remain = 0;
// ======================================


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


// joinaround_match_type three values


router.get('/', (req, res,next) => {	
	
	try {
				var page = req.query.page;            
                // if(!req.query.joinaround_match_type)
                // {
                //     return errors.errorHandler(
                //         res,
                //         'You must send the Team name.'
                //     );
                // }
                		
					Match.find({type: req.query.joinaround_match_type})
					.then(matout => {
					
						nextpageTotal = nextpageTotal + matout.length;

						Match.find({
							type: req.query.joinaround_match_type,
						})
						//.skip((6* req.query.page) - 6).limit(6)
						.then(match => {
							count = count+ 1;			
							resultdata = resultdata + matout.length
							
							if(count == 3)
							{			
							
								 remain = parseInt(resultdata - 6*page);
								console.log('remain				:' + remain);
								if(remain <= 0)
								{
									remain = 0;
									console.log('111111111:					');
									res.status(201).send({
										success: true,							
										data: match || [],											
										meta: {paginate:({next_page:0})},
										currentPage: parseInt( req.query.page)		
									});
			
								}
								else
								{
									 remain = 0;
									console.log('2222222222222:				');
									res.status(201).send({
										success: true,						
										data: match || [],		
										meta: {paginate:({next_page:parseInt(req.query.page) + 1})},
										currentPage: parseInt( req.query.page)		
									});
			
		
								}		
								remain = 0;				
								 first =  true;
								 count = 0;
								 nextpageTotal = 0;
								
								 resultdata = 0;
							}
							else
							{					
								res.status(201).send({
									success: true,						
									data: match || [],						
									currentPage: parseInt( req.query.page)		
								});
							}
						})
						.catch(err => {
								return errors.errorHandler(res, err);
							});	
					}).catch(err => {
						return errors.errorHandler(res, err);
					});
				
			


} catch (e) {
	next(e)
  }
			
});

// get Deatil match
router.get('/:id', (req, res) => {
	console.log('getttt match   :'+req.params.id);
	Match.find({
		_id: req.params.id,

	})
		.then(match => {
			res.status(201).send({
				success: true,
				message: match,				
				rsvp_deadline: match[0].date,
				facility_instance : match[0].facility_instance,
				visitors: match[0].visitors,
				description: match[0].description,
				rsvp_link: match[0].rsvp_link,
				address: match[0].address,
			});
		})
		.catch(err => {
			return errors.errorHandler(res, err);
		});
});



router.post(
	'/', upload.single('match_cover_photo'),
//	auth.validateRefreshToken,
	(req, res, next) => {
		// if (!req.body.name ) {
		// 	return errors.errorHandler(
		// 		res,
		// 		'You must send the Match name.'
		// 	);
		// }		
		console.log(req.file);
	
		console.log('condo_facility_booking_id			:'+ req.body.stadium_id)
		Match.find({ match_title: req.body.match_title })
			.then(match => {
				if (match.length > 0) {
					return errors.errorHandler(
						res,
						'A Match with that Name already exists.'
					);
				}
				// --- unit
				//let newVisitors = _.pick(req.body, 'Status');
				// ---

			//let createdate = Date();
			//console.log("ngay        :"  + createdate);
			//	let passwordHash = bcrypt.hashSync(req.body.password.trim(), 12);
				let newMatch = _.pick(req.body, 'match_title','match_description','country_id','district_id', 'province_id','village_id','address',
				'city_id','country_name','match_date','match_status','match_end',
				'stadium_id');

				// var element = {}, cart = [];
				// element.id = id;
				// element.quantity = '123';
				// cart.push({element: element});


				newMatch.type = 'upcoming'	
	
				return Match.create(newMatch);
			})
			.then(newProduct => {
			//	req.Product = newProduct;
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
module.exports = router;