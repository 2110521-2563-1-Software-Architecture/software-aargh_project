var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
    id: Schema.ObjectId,
    messages: Array,
    uid: { type: Array, required: true, default: [] },
});
module.exports = Chat = mongoose.model('Chat', ChatSchema, 'Chat');