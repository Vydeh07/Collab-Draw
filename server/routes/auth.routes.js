const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { protect } = require('../middleware/auth.middleware'); // <-- THIS IS THE FIX

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ email, password, name });
        res.status(201).json({ userId: user._id });
    } catch (e) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/auth/me - Get logged in user's data
router.get('/me', protect, async (req, res) => {
    try {
        // req.userId is added by the 'protect' middleware
        const user = await User.findById(req.userId).select('-password'); // .select('-password') excludes the password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
