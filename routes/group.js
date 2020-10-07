var express = require('express');
var router = express.Router();
var Group = require('../models/group.js');
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

router.post('/create', (req, res) => {
  const { gname, uid } = req.body;
  Group.find({ name: gname }, (err, groups) => {
    if (err) {
      throw err;
    } else if (groups.length == 0) {
      const group_model = new Group({ name: gname });
      group_model.save((err, group) => {
        if (err) throw err;
        const join_model = new Join({ uid, gid: group.id, read_at: 0 });
        join_model.save((err) => {
          if (err) throw err;
          res.send({ gid: group.id });
        });
      });
    } else {
      res.send({ gid: groups[0].id });
    }
  });
});

router.post('/join', (req, res) => {
  const { gid, uid } = req.body;
  if (!gid || !uid) throw err;
  Group.find({ _id: gid }, (err, groups) => {
    if (err) {
      throw err;
    } else if (groups.length == 0) {
      res.send('NOT FOUND GROUP');
    } else {
      Join.findOne({ uid, gid }, (err, join) => {
        if (join) {
          res.send('EXISTED');
        } else {
          const join_model = new Join({ uid, gid, read_at: Date.now() });
          join_model.save((err) => {
            if (err) throw err;
            else res.send('EXISTED');
          });
        }
      });
    }
  });
});

router.post('/leave', (req, res) => {
  const query = { uid: req.body.uid, gid: req.body.gid };
  Join.remove(query, (err, joins) => {
    if (err) return res.send('ERROR');
    else return res.send('SUCCESS');
  });
});

const toList = (a) => Object.keys(a).map((e) => a[e]);
router.get('/all', (req, res) => {
  const { uid } = req.query;
  Group.find({}, (err, groups) => {
    if (err) {
      throw err;
    } else {
      const all = groups.reduce((map, i) => {
        map[i.id] = { gid: i.id, name: i.name, join: false, unread: false };
        return map;
      }, {});
      Join.find({ uid }, async (err, joins) => {
        if (err) {
          res.send(toList(all));
        } else {
          await Promise.all(
            joins.map(async ({ gid, read_at }) => {
              all[gid].join = true;
              const queryUnread = { send_at: { $gt: read_at }, gid };
              const unreadMessage = await getListMessage(queryUnread);
              if (unreadMessage.length > 0) {
                all[gid].unread = true;
              }
            })
          );
          res.send(toList(all));
        }
      });
    }
  });
});

module.exports = router;
