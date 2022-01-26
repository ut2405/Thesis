'use strict';

require("dotenv").config();

const url=process.env.DB_HOST;

const { Int32 } = require("bson");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logsSchema = mongoose.Schema({ 

	user 			: String,
	action		    : String, 
	time			: String,
	note	        : String	
});

mongoose.Promise = global.Promise;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose.model('logs', logsSchema);