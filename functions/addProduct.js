'use strict';

const product = require('../models/product');

exports.addProduct = (name, code, type, currentAmount, maxStock) => 

	new Promise((resolve,reject) => {

		const newProduct = new product({

			name: name,
			code: code,
			type: type,			
            currentAmount: currentAmount,
			maxStock: maxStock
		});

		newProduct.save()

		.then(() => resolve({ status: 201, message: 'Product add Sucessfully !' }))

		.catch(err => {

			if (err.code == 11000) {

				reject({ status: 409, message: 'Product Already Added !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
	});