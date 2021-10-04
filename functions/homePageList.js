'use strict';

const product = require('../models/product');

exports.getHomePage = () => 

	new Promise((resolve,reject) => {

		product.find({  },{sort:{type: 1}, projection:{ name: 1, code: 0, type: 0, currentAmount: 1, maxStock: 1 },})

		.then(products => resolve(products))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});