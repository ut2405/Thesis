'use strict';

const storage = require('../models/storage');

exports.getRecords = item => 

	new Promise((resolve,reject) => {

		storage.find({item:item, $expr:{$gt:["$inAmount","$outAmount"]}}).sort({dateInStock: 1})

		.then(storages => resolve(storages))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});


exports.getStorageFrT = (from, to) => 

	new Promise((resolve,reject) => {

		storage.find({ dateInStock:{
            $gte: ISODate(from),
            $lt: ISODate(to),
        } },{sort:{dateInStock: 1}, projection:{ item: 1, inAmount: 1, outAmount: 1, dateInStock : 1, dateExpiry: 1 },},)

		.then(storages => resolve(storages))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

    exports.getStorageReportFrT = (from, to) => 

	new Promise((resolve,reject) => {

		storage.find({ dateInStock:{
            $gte: ISODate(from),
            $lt: ISODate(to),
        } },
        { $group : { _id : "$item", inAmountSum: { $sum: "$inAmount" } ,outAmountSum: { $sum: "$outAmount" } }},
        {sort:{inAmountSum: 1},},)

		.then(storages => resolve(storages))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});