'use strict';

const storage = require('../models/storage');

exports.getStorage = (from, to) => 

	new Promise((resolve,reject) => {

		storage.find({ datetime:{
            $gte: ISODate(from),
            $lt: ISODate(to),
        } },{sort:{datetime: 1}, projection:{ datetime: 1, productCode: 1, inAmount: 1, outAmount : 1, user: 1 },},)

		.then(storages => resolve(storages))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

    exports.getStorageReport = (from, to) => 

	new Promise((resolve,reject) => {

		storage.find({ datetime:{
            $gte: ISODate(from),
            $lt: ISODate(to),
        } },
        { $group : { _id : "$productCode", inAmountSum: { $sum: "$inAmount" } ,outAmountSum: { $sum: "$outAmount" } }},
        {sort:{inAmountSum: 1},},)

		.then(storages => resolve(storages))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});