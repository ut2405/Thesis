'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const register = require('./functions/register');
const login = require('./functions/login');
const profile = require('./functions/profile');
const password = require('./functions/password');
const itemsList =require('./functions/itemlist');
const addItem=require('./functions/addItem');
const editItem=require('./functions/editItem');
const updateOverall=require('./functions/updateOverall');
const addType=require('./functions/addType');
const editType=require('./functions/editType');
const inOut=require('./functions/inOut');
const editInOut=require('./functions/editInOut');
const addLogs=require('./functions/addLogs');
const logsList = require('./functions/logsList');
const storages=require('./functions/storageList');
const config = require('./config/config.json');
const typeList=require('./functions/typeList');
const overall=require('./functions/getOverAll');
const { callbackPromise } = require('nodemailer/lib/shared');

module.exports = router => {

	router.get('/', (req, res) => res.end('Server ready!'));

	router.post('/authenticate', (req, res) => {

		const credentials = auth(req);

		if (!credentials) {

			res.status(400).json({ message: 'Invalid Request !' });

		} else {

			login.loginUser(credentials.name, credentials.pass)

			.then(result => {

				const token = jwt.sign(result, config.secret, { expiresIn: 1440 });

				res.status(result.status).json({ message: result.message, token: token });

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.post('/users', (req, res) => {

		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;
		const type = req.body.type;

		if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			register.registerUser(name, email, password, type)

			.then(result => {

				res.setHeader('Location', '/users/'+email);
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.get('/users/:id', (req,res) => {

		if (checkToken(req)) {

			profile.getProfile(req.params.id)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			res.status(401).json({ message: 'Invalid Token !' });
			
		}
	});

	router.put('/users/:id', (req,res) => {

		if (checkToken(req)) {

			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;

			if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

				res.status(400).json({ message: 'Invalid Request !' });

			} else {

				password.changePassword(req.params.id, oldPassword, newPassword)

				.then(result => res.status(result.status).json({ message: result.message }))

				.catch(err => res.status(err.status).json({ message: err.message }));

			}
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.post('/users/:id/password', (req,res) => {

		const email = req.params.id;
		const token = req.body.token;
		const newPassword = req.body.password;

		if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

			password.resetPasswordInit(email)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			password.resetPasswordFinish(email, token, newPassword)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});


	router.get('/items/:id/:type', (req,res) => {
		if (checkToken(req)) {
		itemsList.getItems(req.params.type)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));
			//process.on('unhandledRejection',e =>{throw e;})
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.get('/item/alert', (req,res) => {
		
		itemsList.getItemAlert()

			.then(result => {
				//console.log('are you there?'+result);
				res.json(result);
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
	});

	router.post('/items', (req, res) => {

		const item = req.body.item;
		const description = req.body.description;
		const type = req.body.type;
		const barcode = req.body.barcode;
		const maxStock =req.body.maxStock;

		if (!item ||!description || !type || !barcode || !item.trim() || !description.trim() || !type.trim() || !barcode.trim() ) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			addItem.addItem(item, description, barcode, type, maxStock)

			.then(result => {
				updateOverall.updateTypeMaxStock();
				res.status(result.status).json({ message: result.message });
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.put('/items/:id/edit/:item',(req, res)=>{
		if (checkToken(req)) {
		const nitem=req.body.item;
		const description=req.body.description;
		const barcode=req.body.barcode;
		const type=req.body.type;
		const maxStock=req.body.maxStock;

		editItem.updateItem(req.params.item, nitem, description, barcode, type,maxStock)
		.then(result => {
			updateOverall.updateTypeMaxStock();
			res.status(result.status).json({ message: result.message });})
		.catch(err => res.status(err.status).json({ message: err.message }));
		}else{
			res.status(401).json({ message: 'Invalid Token !' });
		}
	})

	router.delete('/items/:id/del/:item',(req, res)=>{
		if (checkToken(req)) {
		editItem.deleteItem(req.params.item)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
		}else{
			res.status(401).json({ message: 'Invalid Token !' });
		}
	})

	router.get('/storages/:id/byItem/:item', (req,res) => {
		if (checkToken(req)) {		
		storages.getRecords(req.params.item)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));
			//process.on('unhandledRejection',e =>{throw e;})
		}else{
			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.post('/storages', (req, res) => {

		const item = req.body.item;
		const inAmount = req.body.inAmount;
		const outAmount = req.body.outAmount;
		const dateInStock = req.body.dateInStock;
		const dateExpiry = req.body.dateExpiry;
		const price = req.body.price;

		if (!item ||!dateInStock ||!item.trim() ||!dateInStock.trim() ) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			inOut.addStorageLine(item, inAmount, outAmount, dateInStock, dateExpiry, price)

			.then(result => {
				updateOverall.updateItem();
				updateOverall.updateType();
				res.status(result.status).json({ message: result.message });	
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}

	});

	router.put('/storages/:id/edit/:objectid',(req, res)=>{
		if (checkToken(req)) {	
		const inAmount = req.body.inAmount;
		const dateInStock = req.body.dateInStock;
		const dateExpiry = req.body.dateExpiry;		
		const price = req.body.price;

		editInOut.updateStorage(req.params.objectid, inAmount, dateInStock, dateExpiry, price)
		.then(result => {
			updateOverall.updateItem();
			updateOverall.updateType();
			res.status(result.status).json({ message: result.message });
		})
		.catch(err => res.status(err.status).json({ message: err.message }));
	}else{
		res.status(401).json({ message: 'Invalid Token !' });
	}
	})

	router.put('/storages/:id/adjustment',(req, res)=>{
		if (checkToken(req)) {	
		const outAmount = req.body.outAmount;		
		const id = req.body._id;

		editInOut.adjustment(id,outAmount)
		.then(result =>{
			updateOverall.updateItem();
			updateOverall.updateType();
		 res.status(result.status).json({ message: result.message });})
		.catch(err => res.status(err.status).json({ message: err.message }));
	}else{
		res.status(401).json({ message: 'Invalid Token !' });
	}
	})

	router.delete('/storages/:id/del',(req, res)=>{
		if (checkToken(req)) {			
		const item=req.body.item;
		const dateInStock=req.body.dateInStock;
		const inAmount=req.body.inAmount;
		const outAmount=req.body.outAmount;
		const dateExpiry=req.body.dateExpiry;

		editInOut.deleteStorageLine(item, inAmount, outAmount, dateExpiry, dateInStock)
		.then(result =>{
			updateOverall.updateItem();
			updateOverall.updateType();
			res.status(result.status).json({ message: result.message });})
		.catch(err => res.status(err.status).json({ message: err.message }));

		}else{
			res.status(401).json({ message: 'Invalid Token !' });
		}
	})

	router.get('/types/all/:id', (req, res) => {
		if (checkToken(req)) {
			//console.log(checkToken(req));
			typeList.getTypeAll()

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));		
		}else{
			res.status(401).json({ message: 'Invalid Token !' });
			//console.log(req.headers['x-access-token']);
			//console.log(checkToken(req));
		}
	});

	router.post('/types', (req, res) => {
		
		const type = req.body.type;
		const description = req.body.description;
		let maxStock = 0;
		//if (req.body.maxStock != null){maxStock=req.body.maxStock;}else{console.log('hello baby null');}

		if (!type || !description || !type.trim() || !description.trim() ) {
			res.status(400).json({message: 'Invalid Request !'});
		} else {
		try{
			addType.addType(type, description, maxStock)
			.then(result => {
				//res.setHeader('Location','/types/'+description);
				res.status(result.status).json({ message: result.message })
			})
			.catch(err => res.status(err.status).json({ message: err.message }));//process.on('unhandledRejection',e =>{throw e;})
		}catch(err){res.status(500).json({message: 'fail add', error:err});}
	}});

	router.put('/types/:id/edit/:type',(req, res)=>{
		if (checkToken(req)) {
		const ntype=req.body.type;
		const ndes=req.body.description;
		const nmaxStock=req.body.maxStock;

		editType.updateType(req.params.type, ntype, ndes, nmaxStock)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
		}else{
			res.status(401).json({ message: 'Invalid Token !' });
			//console.log(checkToken(req));
		}
	})

	router.delete('/types/:id/del/:type',(req, res)=>{
		if (checkToken(req)) {
		editType.deleteType(req.params.type)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
		}else{
			res.status(401).json({ message: 'Invalid Token !' });
		}
	})

	router.get('/logs/90f', (req, res) => {
		logsList.getLogsAll()

		.then(result => res.json(result))

		.catch(err => res.status(err.status).json({ message: err.message }));		
	});

	router.post('/logs', (req, res) => {

		const user = req.body.user;
		const action = req.body.action;
		const time = req.body.time;
		const note = req.body.note;

		if (!user || !action || !time || !user.trim() || !action.trim() || !time.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			addLogs.addLogs(user, action, time, note)

			.then(result => {
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.get('/overAll', (req, res) => {
		overall.getTotalValue()

		.then(result => res.status(result.status).json({ message: result.message}))

		.catch(err => res.status(err.status).json({ message: err.message }));		
	});

	router.get('/countType', (req, res) => {
		overall.countType()

		.then(result => res.status(result.status).json({ message: result.message}))

		.catch(err => res.status(err.status).json({ message: err.message }));		
	});

	router.get('/countItem', (req, res) => {
		overall.countItem()

		.then(result => res.status(result.status).json({ message: result.message}))

		.catch(err => res.status(err.status).json({ message: err.message }));		
	});

	router.get('/countStock', (req, res) => {
		overall.countStorage()

		.then(result => res.status(result.status).json({ message: result.message}))

		.catch(err => res.status(err.status).json({ message: err.message }));		
	});

	router.get('/update',(req, res)=>{
		updateOverall.updateItem()
		.then(result =>{
			updateOverall.updateType();
			res.status(result.status).json({ message: result.message});
		})
		.catch(err => res.status(err.status).json({ message: err.message }));		
	});

	router.get('/getItemOfBC/:id',(req, res)=>{
		overall.getItem(req.params.id)
		.then(result =>	res.json(result))
		.catch(err => res.status(err.status).json({ message: err.message }));		
	});

	function checkToken(req) {

		const token = req.headers['x-access-token'];

		if (token) {

			try {

  				var decoded = jwt.verify(token, config.secret);

  				return decoded.message === req.params.id;

			} catch(err) {

				return false;
			}

		} else {

			return false;
		}
	}
}