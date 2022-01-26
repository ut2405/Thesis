'use strict';
const item =require('../models/item');
const type = require('../models/type');

exports.getTypeAll =() => 	
	new Promise((resolve,reject) => {

		type.find({ })

		.then(types => resolve(types))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
