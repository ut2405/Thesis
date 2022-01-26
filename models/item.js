'use strict';

require("dotenv").config();

const url=process.env.DB_HOST;

const { Int32 } = require("bson");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = mongoose.Schema({ 	
	item 			: String,
	description		: String, 
	barcode			:  String,
	type	        : String,
	maxStock		: Number,
	sumStorage		:Number	
});

mongoose.Promise = global.Promise;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose.model('item', itemSchema);