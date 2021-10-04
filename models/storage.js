'use strict';

require("dotenv").config();

const url=process.env.DB_HOST;

const { Int32 } = require("bson");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storageSchema = mongoose.Schema({ 

	datetime        : String,
	productCode		: String,
	inAmount	    : Number,
	outAmount 	    : Number,
	user		    : String

});

mongoose.Promise = global.Promise;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose.model('storage', storageSchema);