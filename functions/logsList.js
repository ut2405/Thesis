'use strict';
const log = require('../models/logs');

exports.getLogsAll =() => 	
	new Promise((resolve,reject) => {

		log.find({ }).sort({time:-1}).limit(90)

		.then(logs => resolve(logs))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});