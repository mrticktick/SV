const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const Match = require('../models/Products');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const auth = require('./auth');
const config = require('../config/auth.js');
const errors = require('./error');
const validate = require('./Validate_Data.js');
var multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();

// var ObjectId = require('mongodb').ObjectID
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

router.post('/add-product',	//	auth.validateRefreshToken,
	async (req, res, next) => {
		if (!req.body.name) {
			return errors.errorHandler(
				res,
				'You must send the Product name.'
			);
		}
		await prisma.products.findUnique({ where: { name: req.body.name } })
			.then(product => {
				if (product) {
					return errors.errorHandler(
						res,
						'A Product with that Name already exists.'
					);
				}
				let newProduct = _.pick(req.body, 'name', 'typeId', 'supplierId', 'product_code', 'title', 'facility_instance', 'description', 'rsvp_link', 'address', 'createDate', 'createUserId',
					'ModifieldDate', 'ModifieldUserId');
				return prisma.products.create({ data: newProduct });
			}).then(newProduct => {
				success = true;
				req.product = newProduct;
				next();
			})
			.catch(err => {
				return errors.errorHandler(res, err);
			});
	},
	(req, res) => {
		res.status(201).send({
			success: true,
			message: req.product
		});
	}

);

router.get('/get-all-product', async (req, res) => {
	try {
		const allProducts = await prisma.tb_product.findMany();
		res.status(200).send({
			success: true,
			data: allProducts
		});
	} catch (error) {

		console.log('Error:', error);
		return errors.errorHandler(res, error);
	}
});

router.put('/update-product', async (req, res, next) => {
	try {
		if (!req.body.name) {
			return errors.errorHandler(
				res,
				'You must send the Product name.'
			);
		}
		else {

			const model = 'products';
			const condition = { name: req.body.name };
			const exists = await validate.checkRecordExists(model, condition);
			console.log("exists", exists);

			if (!exists) {
				return errors.errorHandler(
					res,
					'Product not found.'
				);
			}

			const editProduct = _.pick(req.body, ['typeId', 'supplierId', 'product_code', 'title', 'facility_instance', 'description', 'rsvp_link', 'address', 'createDate', 'createUserId',
				'ModifieldDate', 'ModifieldUserId']);

			const updatedProduct = await prisma.products.update({
				where: {
					name: req.body.name,
				},
				data: { ...editProduct }
			});

			req.product = updatedProduct;
			next();
		}
	} catch (error) {
		console.log('Error:', error);
		return errors.errorHandler(res, error);
	}
},
	(req, res) => {
		res.status(201).send({
			success: true,
			data: req.product
		});
	}
);

router.post('/delete-product', async (req, res) => {
	try {
		if (!req.body.name) {
			return errors.errorHandler(
				res,
				'You must send the Product name.'
			);
		}
		const productName = req.body.name;

		// Check if product exists first
		const existingProduct = await prisma.products.findUnique({
			where: {
				name: productName
			}
		});

		if (!existingProduct) {
			return res.status(404).json({
				success: false,
				message: "Product not found"
			});
		}

		// If product exists, proceed with deletion
		await prisma.products.delete({
			where: {
				name: productName
			}
		});

		return res.status(200).json({
			success: true,
			message: "Product deleted successfully"
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Error deleting product",
			error: errors.errorHandler(res, error)
		});
	}
});

//get the product detail by id
router.get('/:id', (req, res) => {
	// console.log('getttt match   :'+req.params.id);
	prisma.products.findUnique({
		where: { id: req.params.id, }
	})
		.then(product => {
			res.status(201).send({
				success: true,
				message: product,
				rsvp_deadline: product[0].date,
				facility_instance: product[0].facility_instance,
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
	// req.on('data', (data) => {
	//	console.log("data 	");
	// 	body += data.toString();
	//   });
	//   req.on('end', () => {
	//     console.log(
	//         parse(body.title)
	//     );
	//     res.end('ok');
	// });

	//console.log('bodyyyyy    :'+formData.condo_event_rsvp_deadline);

	var data = {};
	if (formData.condo_event_rsvp_deadline) {
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
	else {
		console.log('u[pppppppppppppppppppppppppppppdate')
		//	Product.findOneAndUpdate({_id:ObjectId(req.params.id)},setObj )
		prisma.products.update(
			{
				where: { id: req.params.id, }
			},
			{

				data: data

				//	description: formData.condo_event_description,
				//title: formData.condo_event_title,
				//date: formData.condo_event_rsvp_deadline,


			}, function (err, doc) {
				if (err) {
					console.log("Something wrong when updating data!");
				}

				console.log(doc);
			})
	}
	res.status(201).send({
		success: true,
	});

});

//getmatchdetail

// router.get('/', (req, res) => {
// 	let nextpageTotal = 0;
// 	Product.find().then(pro => {
// 		nextpageTotal = pro.length;		
// 	}).catch(err => {
// 		return errors.errorHandler(res, err);
// 	});
// 	Product.find({
// 		type: req.query.condo_event_type,
// 	})	//.skip((2 * req.query.page) - 2).limit(2)
// 	.exec(function (err , products){

// 			Product.count().exec(function (err , count){				
// 				let np = Math.ceil(nextpageTotal/6);
// 				let countpage = np - req.query.page;		
// 				if (err) return next(err)

// 			if(countpage > 0 )
// 			{
// 				res.status(201).send({
// 					success: true,
// 					data: products || [],		
// 					//nextPage: parseInt(req.query.page) + 1,
// 					currentPage: parseInt( req.query.page),	
// 					//meta: {paginate:({next_page:Math.ceil(parseInt(req.query.page) + 1)})}// đang dùng	
// 					meta: {paginate:({next_page:0})}
// 				});	
// 			}else{
// 				res.status(201).send({
// 					success: true,
// 					data: products || [],		
// 					//nextPage: parseInt(req.query.page) + 1,
// 					currentPage: parseInt( req.query.page),	
// 					meta: {paginate:({next_page:0})}				//đang dùng
// 				});	
// 			}


// 			})			

// 		})
// 		.catch(err => {
// 			return errors.errorHandler(res, err);
// 		});
// });
let nextpageTotal = 0;
let first = true;
let count = 0;
let resultdata = 0;

// get detail product
router.get('/', (req, res, next) => {
	// function listEvent() {
	//     return new Promise(function(resolve,reject) {
	//         Match.find({"type":req.query.condo_event_type}, function(err,user) {
	//             if (err) {
	//                 reject(err)
	//             } else {
	//                // console.log("yaha b agyaaa");
	//                 var errorsArr = [];
	//                 errorsArr.push(user);
	// 				resolve(errorsArr);				
	//             }

	//         });
	//     });
	// }
	// listEvent().then(function(data) {
	// 	//console.log(data);
	// 	res.status(201).send({
	// 		success: true,
	// 		//nextPage: parseInt(req.query.page) + 1,			
	// 		data: data || [],			
	// 		// meta: {paginate:({next_page:Math.ceil(parseInt(req.query.page) + 1)})},
	// 		meta: {paginate:({next_page:0})},
	// 		currentPage: parseInt( req.query.page)		
	// 	});
	//     next();
	// });


	// ---------------------------------------------------------
	// function listEvent()
	// {

	let page = req.query.page;
	if (!req.query.condo_event_type) {
		return errors.errorHandler(
			res,
			'You must send the Product name.'
		);
	}
	if (page == 1 && first == true) {

		first = false;

		prisma.products.findMany()
			.then(pro => {
				nextpageTotal = pro.length;
			}).catch(err => {
				return errors.errorHandler(res, err);
			});
	}

	prisma.products.findMany({
		type: req.query.condo_event_type,
	}).skip((5 * req.query.page) - 5).limit(5)
		.then(match => {
			count = count + 1;
			resultdata = resultdata + match.length
			//	console.log('countcount>>>'+count+'nextpageTotal'+nextpageTotal+'			demphantuget		:'+demphantuget);
			if (count == 3) {
				//	console.log('hiih');

				if (resultdata - 5 * page <= 0) {
					res.status(201).send({
						success: true,
						//nextPage: parseInt(req.query.page) + 1,			
						data: match || [],
						// meta: {paginate:({next_page:Math.ceil(parseInt(req.query.page) + 1)})},
						meta: { paginate: ({ next_page: 0 }) },
						currentPage: parseInt(req.query.page)
					});

				}
				else {
					res.status(201).send({
						success: true,
						data: match || [],
						meta: { paginate: ({ next_page: parseInt(req.query.page) + 1 }) },
						currentPage: parseInt(req.query.page)
					});
				}
				// ---------------
				// nextpageTotal = 0;
				first = true;
				count = 0;
				demphantuget = 0;
			}
			else {
				//	console.log('else->match.coumt'+nextpageTotal);
				//nextpageTotal -= 5;
				res.status(201).send({
					success: true,
					//nextPage: parseInt(req.query.page) + 1,			
					data: match || [],
					// meta: {paginate:({next_page:Math.ceil(parseInt(req.query.page) + 1)})},
					//meta: {paginate:({next_page:parseInt(req.query.page) + 1})},// 			dang dung
					currentPage: parseInt(req.query.page)
				});
			}
		})
		.catch(err => {
			return errors.errorHandler(res, err);
		});
	// }
});

module.exports = router;
