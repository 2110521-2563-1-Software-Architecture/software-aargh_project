var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  id: Schema.ObjectId,
  username: { type: String, unique: true, required: true, dropDups: true },
  name: String,
  hash: String,
  salt: String,
  phone_number: String,
});
module.exports = User = mongoose.model('User', UserSchema, 'User');
