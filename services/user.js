const User = require('../models/user.js');
const { promiseQuery } = require('../util/promiseQuery')

const create = async data => {
	const user_model = new User(data);
	await user_model.save();
	return { id: user_model._id }
}

const find = async query => {
	const data = await promiseQuery(User, query);
	return data
}


module.exports = { create, find }
