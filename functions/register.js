'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.registerUser = (name, email, password, type) => 

	new Promise((resolve,reject) => {
		user.find({email:email})
		.then(users =>{
			if(users.length>0){
				reject({ status: 409, message: 'User Already Registered !' });
			}else{
				const salt = bcrypt.genSaltSync(10);
				const hash = bcrypt.hashSync(password, salt);
				const newUser = new user({
		
					name: name,
					email: email,
					hashed_password: hash,
					created_at: new Date(),
					type: type
				});
		
				newUser.save()
		
				.then(() => resolve({ status: 201, message: 'User Registered Sucessfully !' }))
		
				.catch(err => {
						reject({ status: 500, message: 'Internal Server Error !' });					
				});
			}
		})
		.catch(err => {
				reject({ status: 500, message: 'Internal Server Error !' });			
		});

	    
	});