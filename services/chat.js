const Chat = require('../models/chat.js');
const { promiseQuery } = require('../util/promiseQuery')

const create = async data => {
	const chat_model = new Chat(data);
	await chat_model.save();
	return { id: chat_model._id, messages: chat_model.messages }
}

const find = async query => {
	const data = await promiseQuery(Chat, query);
	return data
}

const insertMessage = async (_id, data) => {
	const chat_model = await Chat.findOne({ _id });
	chat_model.messages.push(data)
	await chat_model.save();
	return chat_model
}

module.exports = { create, find, insertMessage }
