'use strict';

const storage = require('../models/storage');

exports.addStorageLine = (item, inAmount, outAmount, dateInStock, dateExpiry, price) => 

	new Promise((resolve,reject) => {

		const newStorageLine = new storage({
            item: item,
			inAmount: inAmount,
			outAmount: outAmount,	
			dateInStock: dateInStock,		
			dateExpiry: dateExpiry,
			price: price
		});

		newStorageLine.save()

		.then(() => resolve({ status: 201, message: 'Line added Sucessfully !' }))

		.catch(err => {

			if (err.code == 11000) {

				reject({ status: 409, message: 'Line Already Added !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
	});

	