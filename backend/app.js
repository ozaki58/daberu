const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
    methods: ["GET"]
  },
});
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
mongoose
  .connect('mongodb+srv://shuncode:abc@cluster0.xjbkspr.mongodb.net/message?retryWrites=true&w=majority', {
    
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// ExpressのミドルウェアとしてSocket.IOを使用
app.use((req, res, next) => {
  req.io = io;
  next();
});


// ルートハンドラーの設定
app.use('/register', require('./routes/register'));
io.on('connection', (socket) => {
  console.log('A user connected');

  // マッチングなどのソケット通信の処理をここに記述する
  app.use('/match', require('./routes/matches'));
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});





// Socket.IOの接続を設定


// サーバーの起動

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));