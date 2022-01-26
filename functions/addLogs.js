'use strict';

const logs = require('../models/logs');

exports.addLogs = (user, action, time, note) => 

	new Promise((resolve,reject) => {

		const newLogs = new logs({
			user: user,
			action: action,
			time: time,			
            note: note
		});

		newLogs.save()

		.then(() => resolve({ status: 201, message: 'Logs add Sucessfully !' }))

		.catch(err => {

				reject({ status: 500, message: 'Internal Server Error !' });
			
		});
	});