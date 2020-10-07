var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var Otp = require('../models/otp.js');
var Chat = require('../models/chat.js');
var Join = require('../models/join.js');

router.post('/add', (req, res) => {
    const { uid, fid } = req.body;
    const query = { uid, fid };
    Friend.find(query, async (err, users) => {
      if (err) {
        throw err
      } else if (users.length == 0) {
        // create new user
        const friend_model_1 = new Friend({ uid, fid });
        await friend_model_1.save((err, new_user) => {
            if (err) throw err
        })
        const friend_model_2 = new Friend({ uid: fid, fid: uid });
        await friend_model_2.save((err, new_user) => {
            if (err) throw err
          });
        res.send({ id: friend_model_1.id })
      } else {
        res.send({ id: users[0].id })
      }
    });
});

router.post('/all', (req, res) => {
    const { uid } = req.body;
    res.send([])
});


module.exports = router;
