'use strict';
const typee = require('../models/type');
const product = require('../models/product');
exports.updateType = (type, ntype, ndes) =>

	new Promise((resolve,reject) => {
		product.find().updateMany({type:type}, {type:ntype})	
		
		type.find({ type:type })
        .then(types => {
            let type = types[0];			
			type.type=ntype;
            type.description=ndes;
			return type.save;
        })
		.then(product => resolve({ status: 200, message: 'Type Updated Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.deleteType = (type) =>

	new Promise((resolve,reject) => {
        product.find({ type:type })
        .then(products=>{
            if(products.length<=0){
                typee.find().deleteOne({ type:type })
                
            }else {

				reject({ status: 401, message: 'Remove products first !' });
			}
        })
		
		.then(bills => resolve({ status: 200, message: 'Type Deleted Sucessfully !' }))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});