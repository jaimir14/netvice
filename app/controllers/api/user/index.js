const User = require('mongoose').model('User');
const logger = require('winston');
const auth = require('../../../../lib/validateUser.js');

module.exports = (router) => {
	router.get('/', auth, (req, res) => {
		User.find({
			company: req.decoded.company
		}).select('-password').then((users) => {
			res.status(200).send(users);
		}).catch((err) => {
			logger.error(err);
			res.status(400).send('Please try it later');
		});
	});

	router.post('/', (req, res) => {
		let user = new User(req.body);
		if (req.body._id) {
			res.status(400).send('Maybe you are trying to do a PUT instead of POST');
			return;
		} else if (_roles[req.body.role] == undefined) {
			res.status(400).send('Role not valid');
			return;
		}
		user.save().then((saved) => {
			res.status(201).send('user saved');
		}).catch((err) => {
			logger.error(err);
			res.status(400).send('user not saved');
		});

	});
	router.get('/:id', auth, (req, res) => {
		User.findOne({
			_id: req.params.id,
			company: req.decoded.company
		}).then((user) => {
			res.status(200).send(user);
		}).catch((err) => {
			logger.error(err);
			res.status(400).send('User not found');
		});
	});
	router.put('/', auth, (req, res) => {
		let user = new User(req.body);
		User.findOne({
			_id: user._id,
			company: req.decoded.company
		}).then((oldUser) => {
			user.password = oldUser.password;
			return oldUser.update(user);
		}).then(() => {
			res.status(200).send('user updated')
		}).catch((err) => {
			logger.error(err);
			res.status(400).send('user not updated');
		})
	});
	router.delete('/:id', auth, (req, res) => {
		User.findOne({
			_id: req.params.id,
			company: req.decoded.company
		}).remove().exec().then(() => {
			res.status(200).send('User deleted')
		}).catch((err) => {
			logger.error(err);
			res.status(400).send('User not found');
		});
	});
};