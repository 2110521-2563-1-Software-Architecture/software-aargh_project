var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FriendSchema = new Schema({
    id: Schema.ObjectId,
    uid: Schema.ObjectId,
    fid: Schema.ObjectId, // friend
});
module.exports = Friend = mongoose.model('Friend', FriendSchema, 'Friend');