var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  id: Schema.ObjectId,
  name: String,
  status: String,
  username: String,
  password: String,
  image: String,
  phone_number: String,
  confirmed_at: Date,
});
module.exports = User = mongoose.model('User', UserSchema, 'User');
