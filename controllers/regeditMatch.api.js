const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const Match = require('../models/Matchs'); 
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const config = require('../config/auth.js');
const errors = require('./error');
var multer  = require('multer')

var upload = multer()

router.use((req, res, next) => {


	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	if (!token) {

		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});
	
	}

	token = token.replace('Bearer ', '');
	jwt.verify(token, config.secret, (err, user) => {
		if (err) {
			
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
	'/AddRegeditMatch',	(req, res, next) => {
				
		if (!checkAddMatch(req)) {
			
			return errors.errorHandler(
				res,
				'You must send the username and the password.'
			);
		}
		Match.find({ match_date: req.body.match_date })
		.then(match => {	
			
			if (match.length > 0) {
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
			let newMatch = _.pick(req.body,
			'country_id', 'district_id','province_id', 'village_id',
			'address','createdate','match_date','match_end','match_status','match_time','hometeam_id','awayteam_id',
			'estimate_time','facility_instance','rsvp_link','visitors','stadium_id');
			//newProduct.visitors = newVisitors
			//newUser.password = passwordHash;
			return Match.create(newMatch);
		})	
		.then(newMatch => {
			// req.match = newMatch;
			res.status(201).send({
				success: true,
				message: newMatch
			});
			next();
		})
		.catch(err => {
			return errors.errorHandler(res, err);
		});	
	},	
);


router.get('/getAllMatch', (req, res) => {
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

router.put('/UpdateMatch', (req, res, next) => {

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
	}
		res.status(201).send({
			success: true,
			
		});
});

router.post('/DeleteMatch', (req, res, next) => {

	if (!req.body.name ) {
		return errors.errorHandler(
			res,
			'You must send the Product name.'
		);
	}
	else{
		
		Product.findOneAndRemove(
			{ name: req.body.name },function(err, doc){		
				if(err){
					console.log("Something wrong when updating data!");
				}
			
				console.log(doc);
			});		
	}
		res.status(201).send({
			success: true,			
		});
});

//getmatchdetail
router.get('/:id', (req, res) => {
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

router.put('/:id', upload.array(), (req, res) => {
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
	
	Product.findOneAndUpdate(
		{ 
			_id: req.params.id,		
		},
		{		
			$set:data		
			
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


let nextpageTotal = 0;
let first =  true;
let count = 0;

router.get('/', (req, res,next) => {
		
				let page = req.query.page;
				
				if(page == 1 && first == true)				{
					
					first = false;
					
					Match.find()
					.then(pro => {
						nextpageTotal = pro.length;		
					}).catch(err => {
						return errors.errorHandler(res, err);
					});
				}
				Match.find({
					type: req.query.condo_event_type,
				}).skip((5 * req.query.page) - 5).limit(5)
				.then(match => {
					count = count+ 1;	
					console.log('countcount>>>'+count+'nextpageTotal'+nextpageTotal);
					if(count == 3)
					{
						console.log('hiih');
						
						if(nextpageTotal - 5*page <= 0)
						{
							res.status(201).send({
								success: true,
								//nextPage: parseInt(req.query.page) + 1,			
								data: match || [],			
								// meta: {paginate:({next_page:Math.ceil(parseInt(req.query.page) + 1)})},
								meta: {paginate:({next_page:0})},
								currentPage: parseInt( req.query.page)		
							});
	
						}
						else
						{
							res.status(201).send({
								success: true,						
								data: match || [],		
								meta: {paginate:({next_page:parseInt(req.query.page) + 1})},
								currentPage: parseInt( req.query.page)		
							});
	

						}
						// ---------------
						// nextpageTotal = 0;
						 first =  true;
						 count = 0;
					}
					else
					{
						console.log('match.coumt'+nextpageTotal);
						//nextpageTotal -= 5;
						res.status(201).send({
							success: true,
							//nextPage: parseInt(req.query.page) + 1,			
							data: match || [],			
							// meta: {paginate:({next_page:Math.ceil(parseInt(req.query.page) + 1)})},
							//meta: {paginate:({next_page:parseInt(req.query.page) + 1})},// 			dang dung
							currentPage: parseInt( req.query.page)		
						});
					}
				})
				.catch(err => {
						return errors.errorHandler(res, err);
					});
	// }
});

function checkAddMatch(params) {
	
	if(!params.body.country_id || !params.body.district_id || !params.body.province_id || !params.body.village_id || !params.body.address)
	{
		console.log("Please choose region!");
		return false	
	}
	else if(params.body.typematch == 1 && !params.body.estimate_time)
	{
		console.log("please choose estimate time to begin the match");
		return false	
	}
	else if(!params.body.match_time || !params.body.match_date)
	{
		//console.log("Something wrong when updating data!");
		return false	
	}
	return true
}

module.exports = router;
