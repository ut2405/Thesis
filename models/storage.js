'use strict';

require("dotenv").config();

const url=process.env.DB_HOST;

const { Int32 } = require("bson");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storageSchema = mongoose.Schema({ 
	
	item			: String,
	inAmount	    : Number,
	outAmount 	    : Number,
	dateInStock		: String,
	dateExpiry		: String,
	price			: Number
});

mongoose.Promise = global.Promise;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose.model('storage', storageSchema);