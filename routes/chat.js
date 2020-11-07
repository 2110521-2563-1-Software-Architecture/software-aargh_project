var express = require('express');
var router = express.Router();
const ChatService = require('../services/chat');
const passport = require('passport')

const admin = require('firebase-admin');
const database = admin.database();

router.post('/create',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { _id: user_id } = req.user
    const { uid: _uid } = req.body
    try {
      const uid = [..._uid, user_id.toString()]
      const { id } = await ChatService.create({ uid });
      await Promise.all(uid.map(async memberId => {
        let dbRef = database.ref(`chat/${memberId}/${id}`)
        await dbRef.set({
          cid: id,
          read: false
        })
      }))
      res.send({ id });
    } catch (error) {
      console.log(error)
      res.status(400).send('Unknown Error');
    }
  });

// router.post('/detail',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     const { _id: user_id } = req.user
//     const { id } = req.body;
//     const result = await ChatService.find({ _id: id })
//     try {
//       if (result.length === 0) {
//         res.status('404').send({ message: 'Not found chat id!' });
//       } else {
//         const { messages, uid } = result[0]
//         if (uid.indexOf(user_id) >= 0) {
//           res.send({ messages, uid });
//         } else {
//           res.status(400).send({ message: 'This user is not in the chat!!' });
//         }
//       }
//     } catch {
//       res.status(400).send({ message: 'Unknown Error' });
//     }
//   });

module.exports = router;
