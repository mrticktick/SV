const express = require('express');
const router = express.Router();
// const Users = require('../models/Users');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Logger } = require('winston');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('./auth');
const config = require('../config/auth.js');
const errors = require('./error');
var multer = require('multer')
const { logger } = require('../common/log/writeLog.js');
const constants = require('../common/log/constants.js');


var upload = multer()

router.post(
	'/signup',
	(req, res, next) => {
		if (!req.body.email || !req.body.password) {
			return errors.errorHandler(
				res,
				'You must send the username and the password.'
			);
		}
		prisma.user.findUnique({ where: { email: req.body.email } })
			.then(user => {
				if (user?.length > 0) {
					return errors.errorHandler(
						res,
						'A user with that username already exists.'
					);
				}
				let passwordHash = bcrypt.hashSync(req.body.password.trim(), 12);
				// --- unit
				//let newUnit = _.pick(req.body, 'block_name', 'floor_number', 'unit_number');
				// ---
				let newUser = _.pick(req.body, 'name', 'telephone', 'email', 'avatar_url', 'language');
				newUser.language = constants.languageDefault;
				//console.log('newUser   :', newUser);
				newUser.password = passwordHash;
				//new user.condo_unit = newUnit				
				return prisma.user.create({ data: newUser });
			})
			.then(newUser => {
				req.user = newUser;
				next();
			})
			.catch(err => {
				return errors.errorHandler(res, err);
			});
	},
	auth.createToken,
	auth.createRefreshToken,
	(req, res) => {
		res.status(201).send({
			success: true,
			authToken: req.authToken,
			refreshToken: req.refreshToken
		});
	}
);

router.post(
	'/login',
	(req, res, next) => {

		logger.log({
			level: 'info',
			message: req.body.email
		});

		if (!req.body.email || !req.body.password) {
			return errors.errorHandler(
				res,
				'You must send the email and the password.'
			);
		}
		prisma.user.findUnique({ where: { email: req.body.email } })
			.then(user => {

				if (!user || user.length == 0) {
					return errors.errorHandler(res, 'There has been an error.');
				}

				bcrypt.compare(req.body.password, user.password, (err, success) => {
					if (err) {
						return errors.errorHandler(
							res,
							'The has been an unexpected error, please try again later'
						);
					}
					if (!success) {
						return errors.errorHandler(res, 'Your password is incorrect.');
					} else {

						req.user = user;
						req.activity = 'login';
						next();
					}
				});
			})
			.catch(err => {

				logger.log({
					level: 'error',
					message: err
				});

				return errors.errorHandler(res, err);
			});
	},
	auth.createToken,
	auth.createRefreshToken,
	(req, res) => {
		res.status(201).send({
			success: true,
			//authToken: req.authToken,
			//refreshToken: req.refreshToken
			access_token: req.authToken,
			is_verified: req.refreshToken,
			language: req.user.language,
			user: req.user
		});
	}
);

router.post(
	'/refreshToken',
	auth.validateRefreshToken,
	//	auth.createRefreshToken,
	auth.createToken,
	(req, res) => {

		res.status(201).send({
			success: true,
			authToken: req.authToken
		});
	}
);

router.get('/languages', (req, res) => {
	prisma.user.findUnique({
		where: {
			email: req.user.email,
		},
	}).then(users => {
		res.status(201).send({
			success: true,
			language: users.language
		});
	})
		.catch(err => {
			return errors.errorHandler(res, err);
		});
});

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

router.post('/getAll', (req, res) => {
	prisma.user.findMany()
		.then(users => {
			res.status(201).send({
				success: true,
				message: users
			});
		}).catch(err => {
			return errors.errorHandler(res, err);
		});
});

router.get('/me', (req, res) => {
	console.log('hearder  	:' + req.headers['id']);
	prisma.user.findUnique({
		where: {
			id: req.headers['id'],
		},
	}).then(users => {
		res.status(201).send({
			success: true,
			userinfo: users
		});
	}).catch(err => {
		return errors.errorHandler(res, err);
	});
});

router.post('/me', upload.array(), (req, res) => {

	let formData = req.body;

	if (!formData.email) {
		return errors.errorHandler(
			res,
			'the user not match.'
		);
	}
	else {

		prisma.user.update({
			where: {
				email: formData.email
			},
			data: {
				name: formData.name,
				email: formData.email,
				telephone: formData.telephone
			},

		}).then(users => {
			res.status(201).send({
				success: true,
				userinfo: users
			});
		}).catch(err => {
			return errors.errorHandler(res, err);
		});
	}
});

router.post('/recharge', (req, res) => {

	if (!req.body.email && !req.body.recharge) {
		return errors.errorHandler(
			res,
			'the user not match.'
		);
	}
	else {

		prisma.user.update({
			where: {
				email: formData.email
			},
			data: {
				name: formData.name,
				email: formData.email,
				telephone: formData.telephone
			},
		}, function (err, doc) {
			if (err) {
				console.log("Something wrong when updating data!");
			}

			console.log(doc);
		}
		)
		res.status(201).send({
			success: true,
			user: req.user
		});
	}
});

module.exports = router;
