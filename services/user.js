const User = require('../models/user.js');
const { promiseQuery } = require('../util/promiseQuery')

const create = async ({ name, username, password, phone_number }) => {
	const data = { name, username, password, phone_number }
	const user_model = new User(data);
	await user_model.save();
	return { id: user_model._id }
}

const find = async query => {
	const data = await promiseQuery(User, query);
	return data
}

const insertChat = async ({ cid, uid }) => {
	const user_models = await find({ $or: uid.map(id => ({ _id: id })) });
	await Promise.all(
		user_models.map(async user_model => {
			user_model.chat_list.push(cid)
			await user_model.save()
		})
	)
	return user_models
}

module.exports = { create, find, insertChat }
