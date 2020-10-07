var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
	id: Schema.ObjectId,
	uid: Schema.ObjectId,
	cid: Schema.ObjectId,
	content: String,
	type: String, // WORD, IMAGE, VIDEO
	send_at: Date,
	reply_id: Schema.ObjectId,
	unsent_at: Date,
});
module.exports = Message = mongoose.model('Message', MessageSchema, 'Message');