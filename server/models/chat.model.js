const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shape: { type: Object, required: true }, // Storing the shape object directly
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;