const Users = require('../models/Users');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.js');
const errors = require('./error');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// var APIKEY = require('../const');


let createToken = (req, res, next) => {
	//console.log("create Token 111111", req.user);

	// req.authToken = jwt.sign(
	// //	_.omit(req.user.toObject(), 'password'),
	// _.omit(req.user, 'password'),	config.secret,
	// 	{
	// 		expiresIn: 5
	// 	}
	// );

	// req.authToken = jwt.sign(req.user, config.secret, { 
	// 	expiresIn: 60*60*60
	// });

	var payload = { username: req.user };
	req.authToken = jwt.sign(payload, config.secret, { expiresIn: 60 * 60 * 60 });
	//console.log("req.authToken1111    :", req.authToken);

	// console.log("tokennnnnnn    "+ req.authToken);
	next();
};

let createRefreshToken = (req, res, next) => {	
	//if refresh token doesnt exist already. It won't exist when signing up abviously, but when the user logs in they should have one already in the DB. This just adds one in if they haven't (testing mainly). It doesn't always need to be in the /login endpoint route
	console.log('req.user.refreshToken   333  :', !req.user.refreshToken);
	if (!req.user.refreshToken) {
		req.refreshToken = jwt.sign({ type: 'refresh' }, config.secret, {
			expiresIn: 60 * 60 * 24 * 90
		});
		prisma.user.update({
			where: {
				email: req.user.email,
			},
			data: {
				refreshToken: req.refreshToken,
			},
		})
			.then(() => {				
				next();
			})
			.catch(err => {				
				return errors.errorHandler(res, err);
			});
	} else {
		req.refreshToken = req.user.refreshToken;
		next();
	}
};

let validateRefreshToken = (req, res, next) => {

	if (req.body.refreshToken != '') {

		Users.findOne({ refreshToken: req.body.refreshToken })
			.then(user => {
				req.user = user;
				next();
			})
			.catch(err => {

				return errors.errorHandler(res, err);
			});
	} else {
		return errors.errorHandler(res, 'There is no refresh token to check.');
	}
};

module.exports = {
	createToken,
	createRefreshToken,
	validateRefreshToken
};
