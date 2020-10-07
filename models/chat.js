var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
    id: Schema.ObjectId,
});
module.exports = Chat = mongoose.model('Chat', ChatSchema, 'Chat');