const mongoose = require('mongoose');
const logger = require('winston');
const bcrypt = require('bcryptjs');
const conf = require('../../config/development');
const addressSchema = mongoose.model('Address');
const encrypt = require('mongoose-encryption');

Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const SALT_WORK_FACTOR = conf.secret.salt;

const userSchema = mongoose.Schema({
	name: String,
	userName: {
		type: String,
		unique: true,
		required: true,
		index: true
	},
	password: {
		type: String,
		select: false
	},
	address: addressSchema.schema,
	email: {
		type: String,
		unique: true,
		required: true,
		dropDups: true
	},
	phones: [{
		type: String,
		match: [/\(?([0-9]{3})\)?([ ]?)([0-9]{4})([ -]?)([0-9]{2})([ ]?)([0-9]{2})/, 'Please fill a valid telephone number']
	}],
	role: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
});

userSchema.index({
	userName: 1,
	email: 1
}, {
	unique: true
});

const errorHandling = (error, doc, next) => {
	logger.error(error);
	if (error.name === 'MongoError' && error.code === 11000) {
		next(new Error('There was a duplicate key error'), doc);
	} else {
		next(error, doc);
	}
};

userSchema.post('save', errorHandling);
userSchema.post('update', errorHandling);
userSchema.pre('save', function(next) {
	let user = this;

	if (!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		// hash the password along with our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) {
				logger.err(err);
			}
			resolve(isMatch);
		})
	});
};

userSchema.plugin(encrypt, {
	secret: conf.secret.key,
	excludeFromEncryption: ['password']
})
const User = mongoose.model('User', userSchema);