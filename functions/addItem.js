'use strict';

const item = require('../models/item');

exports.addItem = (itemm, description, barcode, type, maxStock) => 

	new Promise((resolve,reject) => {
		
		item.find({item:itemm})
		.then(items =>{
			if(items.length>0){
				reject({status: 409, message: 'Item Already Added !'})
			}else{
				if(item.find({barcode:barcode})){
					reject({status: 409, message: 'Barcode Already Added !'})
				}else{
					const newItem = new item({

						item: itemm,
						description: description,
						barcode: barcode,			
						type: type,
						maxStock: maxStock
			
					});
			
					newItem.save()		
					.then(() =>{ 
											
						resolve({ status: 201, message: 'Item add Sucessfully !' });
						})
			
					.catch(err => {
			
							reject({ status: 500, message: 'Internal Server Error !' });
						
					});
				}
				
			}
		})
		.catch({ status: 500, message: 'Internal Server Error !' });
		
	});