'use strict';

const storage = require('../models/storage');

exports.updateStorage = (_id, inAmount, dateInStock, dateExpiry, price) =>

	new Promise((resolve,reject) => {
		storage.updateOne({_id:_id},{$set:{inAmount:inAmount, dateInStock:dateInStock, dateExpiry:dateExpiry, price:price}})
		
		.then(() => resolve({ status: 200, message: 'Storage Updated Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.adjustment = (id,outAmount) =>

	new Promise((resolve,reject) => {
		storage.updateOne({_id:id},{$set:{outAmount:outAmount}})
		
		.then(() => resolve({ status: 200, message: 'Storage Updated Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

    exports.deleteStorageLine = (item, inAmount, outAmount, dateExpiry, dateInStock) =>

	new Promise((resolve,reject) => {
        storage.deleteOne({item : item, inAmount:inAmount, outAmount:outAmount, dateExpiry:dateExpiry,dateInStock: dateInStock})
		
		.then(result => resolve({ status: 200, message: 'Stock line deleted sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});