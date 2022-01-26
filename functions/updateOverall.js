'use strict';
const type = require('../models/type');
const itemm = require('../models/item');
const storage = require('../models/storage');
exports.updateItem = () =>

	new Promise((resolve,reject) => {
        storage.aggregate([{
            $group:{_id:"$item",totalAmount:{$sum:{$subtract:["$inAmount","$outAmount"]}}}
        }])
        .then((storages)=>{                
                storages.forEach(storagee=>{
                itemm.updateOne({item:storagee._id},{$set:{sumStorage:storagee.totalAmount}})		
		        .then(() => resolve({ status: 200, message: 'item sum Updated Sucessfully !' }))
                .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
            })            
        })
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
	});

    exports.updateType = () =>

	new Promise((resolve,reject) => {
        itemm.aggregate([{
            $group:{_id:"$type",totalAmount:{$sum:"$sumStorage"}}
        }])
        .then((items)=>{                
                items.forEach(item=>{
                type.updateOne({type:item._id},{$set:{sumStorage:item.totalAmount}})		
		        .then(() => resolve({ status: 200, message: 'Updated Sucessfully !' }))
                .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
            })            
        })
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
	});
    
    exports.updateTypeMaxStock = () =>
    new Promise((resolve,reject) => {
        itemm.aggregate([{
            $group:{_id:"$type",maxStockt:{$sum:"$maxStock"}}
        }])
        .then((items)=>{                
                items.forEach(item=>{
                type.updateOne({type:item._id},{$set:{maxStock:item.maxStockt}})		
		        .then(() => resolve({ status: 200, message: 'item maxStock Updated Sucessfully !' }))
                .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
            })            
        })
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
	});