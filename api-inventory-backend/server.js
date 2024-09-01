require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5001',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/apis', require('./routes/apis'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('message', 'Welcome to the API Security Dashboard!');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const emitScanProgress = (progress) => {
    io.emit('scanProgress', progress);
};

module.exports = { emitScanProgress };

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
