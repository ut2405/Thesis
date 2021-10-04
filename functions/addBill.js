'use strict';

const bill = require('../models/bill');

exports.addBill = (code, billName, amount, dueDate, payOff) => 

	new Promise((resolve,reject) => {

		const newBill = new bill({
			
			code: code,
			billName: billName,			
			amount: amount,
			dueDate: dueDate,
            payOff: payOff
		});

		newBill.save()

		.then(() => resolve({ status: 201, message: 'Bill add Sucessfully !' }))

		.catch(err => {

			if (err.code == 11000) {

				reject({ status: 409, message: 'Bill Already Added !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
	});