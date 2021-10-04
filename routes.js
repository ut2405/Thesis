'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const register = require('./functions/register');
const login = require('./functions/login');
const profile = require('./functions/profile');
const password = require('./functions/password');
const addBill=require('./functions/addBill');
const billList=require('./functions/billList');
const editBill=require('./functions/editBill');
const addProduct=require('./functions/addProduct');
const editProduct=require('./functions/editProduct');
const addType=require('./functions/addType');
const inOut=require('./functions/inOut');
const storageReport=require('./functions/storageReport');
const homePageList=require('./functions/homePageList');
const config = require('./config/config.json');

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

		if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			register.registerUser(name, email, password)

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

	router.post('/bills', (req, res) => {

		const code = req.body.code;
		const name = req.body.name;
		const amount = req.body.amount;
		const dueDate = req.body.dueDate;
		const payOff = req.body.payOff;

		if (!code ||!name || !amount || !dueDate || !payOff || !code.trim() || !name.trim() || !amount.trim() || !payOff.trim() || !dueDate.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			addBill.addBill(code, name, amount, dueDate, payOff)

			.then(result => {
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.get('/bills/get', (req,res) => {
		const from=req.body.from;
		const to=req.body.to;
		
			billList.getBillList(from, to)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
		
	});

	router.put('/bills/edit',(req, res)=>{

		const code=req.body.code;
		editBill.updateBill(code)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
	})

	router.delete('/bills/del',(req, res)=>{

		const code=req.body.code;
		editBill.deleteBill(code)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
	})

	router.post('/products', (req, res) => {

		const name = req.body.name;
		const code = req.body.code;
		const type = req.body.type;
		const currentAmount = req.body.currentAmount;
		const maxStock = req.body.maxStock;

		if (!code ||!name || !type || !currentAmount || !maxStock || !code.trim() || !name.trim() || !type.trim() || !currentAmount || !maxStock) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			addProduct.addProduct(name, code, type, currentAmount, maxStock)

			.then(result => {
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.put('/products/edit',(req, res)=>{

		const code=req.body.code;
		const nname=req.body.nname;
		const ntype=req.body.ntype;
		const nmaxstock=req.body.nmaxstock;

		editProduct.updateProduct(code, nname, ntype, nmaxstock)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
	})

	router.delete('/products/del',(req, res)=>{

		const code=req.body.code;
		editProduct.deleteProduct(code)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
	})

	router.post('/storages', (req, res) => {

		const datetime = req.body.datetime;
		const productCode = req.body.productCode;
		const inAmount = req.body.inAmount;
		const outAmount = req.body.outAmount;
		const user = req.body.user;

		if (!datetime ||!productCode || !inAmount || !outAmount || !user || !datetime.trim() || !productCode.trim() || !inAmount.trim() || !outAmount.trim() || !user.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			inOut.addStorageLine(datetime, productCode, inAmount, outAmount, user)

			.then(result => {
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.delete('/storages/del',(req, res)=>{

		const productCode=req.body.productCode;
		inOut.deleteStorageLine(productCode)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
	})

	router.post('/type', (req, res) => {

		const type = req.body.type;
		const description = req.body.productCode;

		if (!type ||!description || !type.trim() || !description.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			addType.addType(type, description)

			.then(result => {
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.put('/type/edit',(req, res)=>{

		const type=req.body.type;
		const ntype=req.body.ntype;
		const ndes=req.body.ndes;

		editType.updateType(type, ntype, ndes)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
	})

	router.delete('/type/del',(req, res)=>{

		const type=req.body.type;
		editType.deleteType(type)
		.then(result => res.status(result.status).json({ message: result.message }))
		.catch(err => res.status(err.status).json({ message: err.message }));
	})
}