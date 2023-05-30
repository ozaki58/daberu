// routes/register.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.post('/', async (req, res) => {
  const { name } = req.body; // リクエストボディからnameを取得

  const newUser = new User({
    name
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
