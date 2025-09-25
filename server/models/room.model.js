const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;