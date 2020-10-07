var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Otp = require('../models/otp.js');
var Chat = require('../models/chat.js');
var Join = require('../models/join.js');

router.post('/create', (req, res) => {
  const { type, uid, invited_id, name } = req.body;
  if(type === 'DIRECT') {
    // เช็คว่าเคยมีแชทไหม 
    // ไม่มี ->  สร้าง
    // มี -> ส่ง cid
  } else if (type === 'GROUP') {
    // สร้าง
    // ส่ง cid
  }
  
});

router.post('/all', (req, res) => {
    const { uid } = req.body;
    // ไปเอา ทุก join ของ uid นี้ รวมกับ chat แล้วก้ last message ของแต่ละ chat มา
    // เช็คว่า ว่ามี noti ไหม (เทียบ last_read in join < create_at in last message)
    // return list of chat with noti flag
    
  });



module.exports = router;
