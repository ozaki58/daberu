const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
user1: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
},
user2: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
},
chatId: {
type: String,
required: true,
},
});

module.exports = mongoose.model('Match', matchSchema);