var express = require('express');
var router = express.Router();
const UserService = require('../services/user');
const jwt = require('jsonwebtoken');
const Password = require('../util/password');
const passport = require('passport')
const { TOKEN_KEYWORD } = require('../util/constant');


router.post('/register', async (req, res) => {
  const { name, username, password, phone_number } = req.body;
  try {
    const { hash, salt } = await Password.hash(password)
    const { id } = await UserService.create({ name, username, hash, salt, phone_number })
    res.send({ id })
  } catch (error) {
    if (error.code === 11000) res.status(400).send('Username is already used!');
    else res.status(400).send('Unknown Error');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await UserService.find({ username })
    if (result.length === 0) {
      res.status(400).send('Username or password is wrong!');
    } else {
      const { name, _id: id, hash } = result[0]
      const isPasswordCorrect = await Password.compare(password, hash)
      if (isPasswordCorrect) {
        const token = jwt.sign({ id }, TOKEN_KEYWORD)
        res.send({ name, id, token });
      } else {
        res.status(400).send('Wrong password!!');
      }
    }
  } catch (err) {
    res.status(400).send('Unknown Error');
  }
});

// router.get('/user',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     const user = req.user
//     try {
//       res.send(user);
//     } catch (error) {
//       res.status(400).send({ message: 'Unknown Error' });
//     }
//   });


router.get('/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await UserService.find();
      const usernames = result.map(({ _id, username, name }) => ({ id: _id, username, name }))
      res.send(usernames);
    } catch {
      res.status(400).send('Unknown Error');
    }
  });

module.exports = router;
