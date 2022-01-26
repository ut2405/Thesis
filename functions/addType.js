'use strict';

const type = require('../models/type');

exports.addType = ( typee, description, maxStock) => 

	new Promise((resolve,reject) => {
		type.find({type:typee})
		.then(types=>{
			if(types.length>0){
				reject({ status: 409, message: 'Type Already Added !' });
			}else{
				const newType = new type({

					type: typee,
					description: description,
					maxStock: maxStock
				});
		
				newType.save()
		
				.then(() => resolve({ status: 201, message: 'Type added Sucessfully !' }))
		
				.catch(err => {
						reject({ status: 500, message: 'Internal Server Error !' });					
				});
			}
		})
		.catch();
		
	});