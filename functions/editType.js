'use strict';
const type = require('../models/type');
const item = require('../models/item');
exports.updateType = (typee, ntype, ndes, nmaxStock) =>

	new Promise((resolve,reject) => {		
		
		type.updateOne({type:typee},{type:ntype, description:ndes, maxStock:nmaxStock})
		.then(() => {			
			item.updateMany({type:typee}, {$set:{type:ntype}})	
			.then(()=>{})
			.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
			resolve({ status: 200, message: 'Type Updated Sucessfully !' });
		})

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.deleteType = (typee) =>	
	new Promise((resolve,reject) => {
		item.find({type:typee})
        	.then(items=>{
				if (items.length>0) 
				{						
					reject({ status: 500, message: 'Please delete items of this type first!' });
					
				}else{
					type.deleteOne({ type:typee})
						.then(result => resolve({ status: 200, message: 'Type Deleted Sucessfully !' }))

						.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
						
				}
			})	
			.catch(err => {reject({ status: 500, message: 'Internal Server Error !' }); }	);	});
	