var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Otp = require('../models/otp.js');
var Group = require('../models/group.js');
var Join = require('../models/join.js');

router.post('/register', (req, res) => {
  const { name, username, password, phone_number, image= '' } = req.body;
  const query = { username };
  User.find(query, async (err, users) => {
    if (err) {
      throw err
    } else if (users.length == 0) {
      // create new user
      const user_model = new User({ name, username, password, phone_number, image, status: '', confirmed_at: null });
      await user_model.save((err, new_user) => {
        if (err) throw err
      });

      // sending otp
      const otp_model = new Otp({ uid: user_model.id, phone_number, otp: '1234' });
      otp_model.save((err, new_otp) => {
        if (err) throw err
        res.send({ id: user_model.id, otp_id: new_otp.id })
      });
    } else {
      throw 'Username is already used!'
    }
  });
});

router.post('/otp', (req, res) => {
  const { id, otp } = req.body;
  Otp.find({ id, otp }, (err, otps) => {
    if (err) {
      throw err
    } else if (otps.length === 1) {
      
      // confirm phone number
      User.findOne({ id: otps[0].uid }, (err, user) => {
        if (err) throw err;
        else {
          user.set({ confirmed_at: Date.now() });
          user.save(function (err, update) {
            if (err) throw err;
            else {
              return res.send('SUCCESS');
            }
          });
        }
      });

    } else {
      throw 'Wrong otp'
    }
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = { username, password}
  User.find(query, (err, users) => {
    if (err) {
      throw err
    } else if (users.length === 1) {
      res.send({ "id": users[0].id });
    } else {
      throw 'Username or password is wrong!'
    }
  });
});

// router.get('/user-group', (req, res) => {
//   Join.find({ uid: req.query.uid }, (err, joins) => {
//     if (err) {
//       res.send({ groups: [] });
//     } else {
//       const result = [];
//       const promises = joins.map((join, index) =>
//         Group.find({
//           _id: join.gid
//         }).then(function (groups) {
//           if (groups.length) result.push(groups[0]);
//         })
//       );

//       Promise.all(promises).then(() => {
//         res.send({
//           groups: result
//         });
//       });
//     }

//   });
// });

module.exports = router;
