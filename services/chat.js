const Chat = require('../models/chat.js');
const { promiseQuery } = require('../util/promiseQuery')

const create = async data => {
  const chat_model = new Chat(data);
  await chat_model.save();
  return { id: chat_model._id }
}

const find = async query => {
  const data = await promiseQuery(Chat, query);
  return data
}

module.exports = { create, find }
