'use strict';

const bill = require('../models/bill');

exports.updateBill = (code) =>

	new Promise((resolve,reject) => {

		bill.find({ code:code })
        .then(bills => {
            let bill = bills[0];
			const payyOff=bill.payOff;
			if(payOff==false){
				bill.payOff=true;}
			if(payOff==true){
				bill.payOff=false;}
			return bill.save;
        })
		.then(bills => resolve({ status: 200, message: 'Bill Updated Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.deleteBill = (code) =>

	new Promise((resolve,reject) => {

		bill.find({ code:code }).deleteOne({ code:code })
		.then(bills => resolve({ status: 200, message: 'Bill Deleted Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});