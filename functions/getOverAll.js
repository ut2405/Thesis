const storage =require('../models/storage');
const item =require('../models/item');
const type =require('../models/type');

exports.getTotalValue =() => 

	new Promise((resolve,reject) => {
		storage.aggregate([{
            $group:{_id:null,sum:{
                $sum:{$multiply:[{$subtract:["$inAmount","$outAmount"]},"$price"]}
            }}
        }])

		.then(overAll => resolve({ status: 200, message: overAll[0].sum }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.countStorage =() => 

	new Promise((resolve,reject) => {
		storage.aggregate([{
            $group:{_id:null,sum:{
                $sum:{$subtract:["$inAmount","$outAmount"]}
            }}
        }])

		.then(counts => resolve({ status: 200, message: counts[0].sum }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.countItem =() => 

	new Promise((resolve,reject) => {
		item.find().count()

		.then(counts => resolve({ status: 200, message: counts }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.countType =() => 

	new Promise((resolve,reject) => {
		type.find().count()

		.then(counts => resolve({ status: 200, message: counts }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.getItem = barcode => 

	new Promise((resolve,reject) => {

		item.find({barcode:barcode})

		.then(items => resolve(items[0]))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});