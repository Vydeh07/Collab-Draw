const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models and routes
const User = require('./models/user.model');
const Room = require('./models/room.model');
const Chat = require('./models/chat.model');
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');

const app = express();
const server = http.createServer(app);

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// --- WebSocket Server Setup ---
const wss = new WebSocketServer({ server });

const clients = new Map(); // More efficient way to store clients

function verifyUser(token) {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (e) {
        return null;
    }
}

wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.slice(1));
    const token = urlParams.get('token');
    const userId = verifyUser(token);

    if (!userId) {
        console.log('Connection rejected: Invalid token');
        ws.close();
        return;
    }

    console.log(`Client connected: ${userId}`);
    clients.set(ws, { userId, rooms: new Set() });

    ws.on('message', async (message) => {
        const data = JSON.parse(message.toString());
        const clientData = clients.get(ws);

        if (data.type === 'join_room') {
            clientData.rooms.add(data.roomId);
            console.log(`User ${userId} joined room ${data.roomId}`);
        }

        if (data.type === 'draw') {
            const { roomId, shape } = data;

            // Save shape to DB
            try {
                const room = await Room.findOne({ slug: roomId });
                if (room) {
                    await Chat.create({
                        room: room._id,
                        user: userId,
                        shape: shape,
                    });
                }
            } catch (error) {
                console.error("Error saving chat:", error);
            }

            // Broadcast the drawing data to all clients in the same room
            clients.forEach((client, webSocket) => {
                if (client.rooms.has(roomId) && webSocket !== ws) {
                    webSocket.send(JSON.stringify({ type: 'draw', shape }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${userId}`);
        clients.delete(ws);
    });
});


// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));