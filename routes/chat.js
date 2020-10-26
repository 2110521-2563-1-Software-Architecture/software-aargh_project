var express = require('express');
var router = express.Router();
const ChatService = require('../services/chat');
const UserService = require('../services/user');

router.post('/create', async (req, res) => {
  const { uid } = req.body; // list of user id
  try {
    const { id, messages } = await ChatService.create({ uid });
    await UserService.insertChat({ cid: id, uid });
    res.send({ id, messages });
  } catch (error) {
    res.status(400).send({ message: 'Unknown Error' });
  }
});

router.post('/detail', async (req, res) => {
  const { id } = req.body;
  const result = await ChatService.find({ _id: id })
  try {
    if (result.length === 0) {
      res.status('404').send({ message: 'Not found chat id!' });
    } else {
      const { messages, uid } = result[0]
      res.send({ messages, uid });
    }
  } catch {
    res.status(400).send({ message: 'Unknown Error' });
  }
});

module.exports = router;
