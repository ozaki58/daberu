const express = require('express');
const router = express.Router();
const User = require('../models/users');

const waitingUsers = {};

router.get('/:userId', async (req, res) => {

  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User ${userId} not found`);
      return res.sendStatus(404);
    }

    waitingUsers[userId] = req.io;
   console.log(userId);
    tryMatch(userId);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const tryMatch = async (userId) => {
  const socket = waitingUsers[userId];

  for (const [otherUserId, otherSocket] of Object.entries(waitingUsers)) {
    if (userId !== otherUserId) {
      delete waitingUsers[userId];
      delete waitingUsers[otherUserId];
      console.log(`Matched ${userId} with ${otherUserId}`);

      try {
        const user1 = await User.findById(userId);
        const user2 = await User.findById(otherUserId);
        if (!user1 || !user2) {
          console.log(`Matched users not found`);
          return;
        }
        user1.matchedUserId = user2._id;
        user2.matchedUserId = user1._id;
        await user1.save();
        await user2.save();
        socket.emit('match', otherUserId);
        otherSocket.emit('match', userId);
      } catch (error) {
        console.error(error);
      }

      return;
    }
  }
};

module.exports = router;
