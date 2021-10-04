'use strict';

const product = require('../models/type');

exports.addType = ( type, description) => 

	new Promise((resolve,reject) => {

		const newType = new type({

			type: amount,
			description: description
		});

		newType.save()

		.then(() => resolve({ status: 201, message: 'Type added Sucessfully !' }))

		.catch(err => {

			if (err.code == 11000) {

				reject({ status: 409, message: 'Type Already Added !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
	});