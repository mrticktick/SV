const express = require('express');
const router = express.Router();
const Users = require('../models/Users'); 
const _ = require('lodash');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const auth = require('./auth');
const config = require('../config/auth.js');
const errors = require('./error');
var multer  = require('multer')
let upload  = multer({ storage: multer.memoryStorage() });

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
                		
					Users.find({team_id: req.query.team_id})
					.skip((5* req.query.page) - 5).limit(5)
                        .then(user => 
                            {				
								console.log('remain				:' + remain);
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