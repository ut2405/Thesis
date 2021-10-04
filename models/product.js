'use strict';

require("dotenv").config();

const url=process.env.DB_HOST;

const { Int32 } = require("bson");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({ 

	name 			: String,
	code			: String, 
	type	        : String,	
	currentAmount	: Number,
	maxStock		: Number

});

mongoose.Promise = global.Promise;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose.model('product', productSchema);