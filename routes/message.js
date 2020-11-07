const express = require('express');
const router = express.Router();
const ChatService = require('../services/chat.js');
const passport = require('passport')

const admin = require('firebase-admin');
const database = admin.database();

router.post('/send',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { _id } = req.user
    const uid = _id.toString()
    const { cid, content, type = 'TEXT' } = req.body;
    try {
      const chat = await ChatService.find({ _id: cid });
      if (chat.length == 0) {
        res.status(400).send("chat not found")
        return;
      }
      const members = chat[0].uid
      if (members.indexOf(uid) < 0) {
        res.status(400).send("user is not in this chat!")
        return;
      }
      await Promise.all(members.map(async memberId => {
        let dbRef = database.ref('chat/' + memberId + '/' + cid)
        await dbRef.set({
          cid,
          read: uid === memberId
        })
      }))
      const chatRef = database.ref('message/' + cid)
      const newMessage = chatRef.push();
      await newMessage.set({
        uid, cid, content, type
      })
      res.send("sent")
    } catch (error) {
      res.status(400).send('Unknown Error');
    }
  })

module.exports = router;
