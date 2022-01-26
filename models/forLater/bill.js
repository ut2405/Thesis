'use strict';

require("dotenv").config();

const url=process.env.DB_HOST;

const { Timestamp } = require("bson");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const billSchema = mongoose.Schema({ 
	
	code			: String,
	billName 		: String, 
	amount	        : Number,
	dueDate		    : Date,
	payOff	        : Boolean

});

mongoose.Promise = global.Promise;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose.model('bill', billSchema);