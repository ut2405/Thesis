'use strict';

const storage = require('../models/storage');

exports.addStorageLine = (productCode, inAmount,outAmount, datetime, user) => 

	new Promise((resolve,reject) => {

		const newStorageLine = new storage({

            datetime: datetime,
			productCode: productCode,
			inAmount: inAmount,	
			outAmount: outAmount,		
			user: user
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

	exports.deleteStorageLine = (productCode) =>

	new Promise((resolve,reject) => {
        storage.find().deleteOne({productCode : productCode})
		
		.then(bills => resolve({ status: 200, message: 'Bill Deleted Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});