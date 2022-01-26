'use strict';

const bill = require('../../models/forLater/bill');

exports.getBillList = (from, to) => 

	new Promise((resolve,reject) => {

		bill.find({ dueDate:{
            $gte: ISODate(from),
            $lt: ISODate(to),
        } },{sort:{payOff: 1}, projection:{ billName: 1, code: 0, amount: 1, dueDate: 1, payOff: 1 },})

		.then(bills => resolve(bills))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});