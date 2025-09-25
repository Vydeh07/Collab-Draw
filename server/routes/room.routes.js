const express = require('express');
const Room = require('../models/room.model');
const Chat = require('../models/chat.model');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// POST /api/rooms
router.post('/', protect, async (req, res) => {
    const { slug } = req.body;
    try {
        const roomExists = await Room.findOne({ slug });
        if (roomExists) {
            return res.status(400).json({ message: 'Room already exists with this name' });
        }
        const room = await Room.create({ slug, admin: req.userId });
        res.status(201).json({ roomId: room.slug });
    } catch (e) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/rooms/:slug
router.get('/:slug', async (req, res) => {
    try {
        const room = await Room.findOne({ slug: req.params.slug });
        if (room) {
            res.json({ room });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/rooms/:slug/chats
router.get('/:slug/chats', async (req, res) => {
    try {
        const room = await Room.findOne({ slug: req.params.slug });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const chats = await Chat.find({ room: room._id }).sort({ createdAt: -1 }).limit(100);
        // We only need to return the shapes
        const shapes = chats.map(chat => chat.shape);
        res.json({ shapes });
    } catch (e) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;