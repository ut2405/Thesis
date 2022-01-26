'use strict';

const item = require('../models/item');

exports.getItems = type => 

	new Promise((resolve,reject) => {

		item.find({ type: String(type) })

		.then(items => resolve(items))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

exports.getItemAlert =() => 

	new Promise((resolve,reject) => {
		//const str=NumberDecimal("0.3");
		item.find({$expr:{$lt:[{$divide:[{$multiply:['$sumStorage',100]},'$maxStock']},30]}
				})

		.then(items => resolve(items))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

