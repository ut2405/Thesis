'use strict';

const item = require('../models/item');
const storage = require('../models/storage');

exports.updateItem = (itemm, nitem, ndescription, nbarcode, ntype, maxStock) =>

	new Promise((resolve,reject) => {
		item.updateOne({item:itemm},{item:nitem,description:ndescription,barcode:nbarcode,type:ntype,maxStock:maxStock})		
		.then(() => {			
			storage.updateMany({item:itemm}, {$set:{item:nitem}})	
			.then(()=>{})
			.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
			resolve({ status: 200, message: 'Item Updated Sucessfully !' });
		})
		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

	exports.deleteItem = (itemm) =>	
	new Promise((resolve,reject) => {
		storage.find({ item:itemm})
        	.then(storages=>{
				if (storages.length>0) 
				{															
					reject({ status: 500, message: 'Please delete Storage lines of this item first!' });
				}else
				{
					item.deleteOne({ item:itemm })
						.then(result => resolve({ status: 200, message: 'Item Deleted Sucessfully !' }))

						.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
				}
			})	
			.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
		
	});		
	
	