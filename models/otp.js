var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OtpSchema = new Schema({
	id: Schema.ObjectId,
	uid: Schema.ObjectId,
	phone_number: String,
    otp: String,
});
module.exports = Otp = mongoose.model('Otp', OtpSchema, 'Otp');