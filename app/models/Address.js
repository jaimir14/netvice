const mongoose = require('mongoose');

Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const addressSchema = mongoose.Schema({
	country: Number,
	province: Number,
	canton: Number,
	district: Number,
	neighborhood: String,
	address: String
});

const Address = mongoose.model('Address', addressSchema);