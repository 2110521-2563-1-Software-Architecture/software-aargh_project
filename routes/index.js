var express = require('express');
var router = express.Router();
const UserService = require('../services/user');

router.post('/register', async (req, res) => {
  const { name, username, password, phone_number } = req.body;
  try {
    const { id } = await UserService.create({ name, username, password, phone_number })
    res.send({ id })
  } catch (error) {
    if (error.code === 11000) res.status(400).send({ message: 'Username is already used!' });
    else res.status(400).send({ message: 'Unknown Error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await UserService.find({ username, password })
    if (result.length === 0) {
      res.status('400').send({ message: 'Username or password is wrong!' });
    } else {
      const { name, _id: id, chat_list } = result[0]
      res.send({ name, id, chat_list });
    }
  } catch {
    res.status(400).send({ message: 'Unknown Error' });
  }
});

router.get('/user', async (req, res) => {
  try {
    const result = await UserService.find();
    const usernames = result.map(({ _id, username, name }) => ({ id: _id, username, name }))
    res.send(usernames);
  } catch {
    res.status(400).send({ message: 'Unknown Error' });
  }
});

module.exports = router;
