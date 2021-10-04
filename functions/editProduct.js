'use strict';

const product = require('../models/product');
const storage = require('../models/storage');

exports.updateProduct = (code, nname, ntype, nmaxstock) =>

	new Promise((resolve,reject) => {

		product.find({ code:code })
        .then(products => {
            let product = products[0];			
			product.name=nname;
            product.type=ntype;
            product.maxstock=nmaxstock;
			return product.save;
        })
		.then(product => resolve({ status: 200, message: 'Product Updated Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.deleteProduct = (code) =>

	new Promise((resolve,reject) => {
        storage.find().deleteMany({productCode : code})
		product.find().deleteOne({ code:code })
        
		.then(product => resolve({ status: 200, message: 'Product Deleted Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});