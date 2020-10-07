var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Group = require('../models/group.js');
var Message = require('../models/message.js');
var Join = require('../models/join.js');

const promiseQuery = (model, query) =>
  new Promise((resolve, reject) =>
    model.find(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  );

const getListMessage = async (query) => {
  const messages = await promiseQuery(Message, query);
  const new_messages = await Promise.all(
    messages.map(async (message) => {
      const user = await promiseQuery(User, { _id: message.uid });
      return { ...message._doc, user: user[0] };
    })
  );
  return new_messages;
};

router.post('/all', async (req, res) => {
  const { cid, uid } = req.body;
  Join.find({ uid, cid }, async (err, join) => {
    if (err) {
      throw err;
    } else if (join.length) {
      const read_at = join[0].read_at;
      const queryRead = { send_at: { $lte: read_at }, cid };
      const queryUnread = { send_at: { $gt: read_at }, cid };
      const readMessage = await getListMessage(queryRead);
      const unreadMessage = await getListMessage(queryUnread);
      res.send({ readMessage, unreadMessage });
    }
  });
});

// router.get('/unread', (req, res) => {
//   const { uid, gid } = req.query;
//   Join.find({ uid, gid }, function (err, join) {
//     if (err) {
//       throw err;
//     } else if (join.length) {
//       const read_at = join[0].read_at;
//       const query = { send_at: { $gt: read_at }, gid };
//       Message.find(query)
//         .sort('send_at')
//         .exec((err, messages) => {
//           if (err) throw err;
//           else {
//             const promises = messages.map((message) => {
//               return new Promise((resolve, reject) => {
//                 User.findById(message.uid, (err, user) => {
//                   if (err) {
//                     reject();
//                   } else {
//                     message._doc.user = user;
//                     resolve();
//                   }
//                 });
//               });
//             });

//             Promise.all(promises)
//               .then(() => {
//                 res.send({ messages: messages });
//               })
//               .catch((err) => {
//                 res.send('FAIL');
//               });
//           }
//         });
//     }
//   });
// });

router.post('/send', (req, res) => {
  const { cid, uid, content, type, reply_id = null } = req.body;
  var query = Chat.findOne({ cid }).select('cid');
  query.exec((err, group) => {
    if (err) throw err;
    else {
      const message_model = new Message({
        uid,
        cid,
        content,
        type,
        reply_id,
        send_at: Date.now(),
        unsent_at: null,
      });
      message_model.save((err, result) => {
        if (err) {
          res.send('ERROR');
          throw err;
        } else {
          User.find({ _id: message_model.uid }, async (err, users) => {
            let message = result._doc;
            message.user = users[0];
            Message.find({}).then((allMessages) => {
              res.send({ message: message, messageOrder: allMessages.length });
            });
          });
        }
      });
    }
  });
});

router.post('/unsend', (req, res) => {
  const { mid } = req.body;
  Message.findOne({ id: mid }, (err, messages) => {
    if (err) throw err;
    else if (messages == null) return res.send('ERROR');
    else {
      messages.set({ unsent_at: Date.now() });
      messages.save(function (err, update) {
        if (err) throw err;
        else {
          return res.send('SUCCESS');
        }
      });
    }
  });
});

router.post('/read', async (req, res) => {
  const { uid, cid } = req.body;
  Join.findOne({ uid, cid }, (err, joins) => {
    if (err) throw err;
    else if (joins == null) return res.send('ERROR');
    else {
      joins.set({ read_at: Date.now() });
      joins.save(function (err, update) {
        if (err) throw err;
        else {
          return res.send('SUCCESS');
        }
      });
    }
  });
});

module.exports = router;
