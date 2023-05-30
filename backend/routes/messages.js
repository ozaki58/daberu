const express = require('express');
const router = express.Router();
const Message = require('../models/messages');
const http = require('http');

// Socket.ioをインポート
const socketIo = require('socket.io');

const app = express();
const server = http.Server(app);

// 初期化
const io = socketIo(server);

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const message = new Message({
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    message: req.body.message
  });

  try {
    const newMessage = await message.save();
    io.getIO().to(req.body.receiverId).emit('messages', { action: 'create', message: newMessage });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
