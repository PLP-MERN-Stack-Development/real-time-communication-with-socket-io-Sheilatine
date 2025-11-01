// server/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = {}; // socket.id -> { username, id }
const messages = []; // store messages globally (can paginate)
const typingUsers = {}; // socket.id -> username

// Function to paginate messages
function getPaginatedMessages(page = 1, limit = 20) {
  const start = Math.max(messages.length - page * limit, 0);
  return messages.slice(start, messages.length).reverse();
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id, online: true };
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
  });

  // Handle sending message
  socket.on('send_message', (messageData, ack) => {
    const message = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message: messageData.message,
      timestamp: new Date().toISOString(),
      readBy: [],
      reactions: {},
    };

    messages.push(message);
    if (messages.length > 200) messages.shift();

    io.emit('receive_message', message);

    // Delivery acknowledgment
    if (ack) ack({ status: 'delivered', id: message.id });
  });

  // Handle typing status
  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      if (isTyping) typingUsers[socket.id] = users[socket.id].username;
      else delete typingUsers[socket.id];
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Private messages
  socket.on('private_message', ({ to, message }) => {
    const msg = {
      id: Date.now(),
      sender: users[socket.id]?.username,
      senderId: socket.id,
      receiverId: to,
      message,
      isPrivate: true,
      timestamp: new Date().toISOString(),
    };
    socket.to(to).emit('private_message', msg);
    socket.emit('private_message', msg);
  });

  // Reactions
  socket.on('react_message', ({ messageId, reaction }) => {
    const msg = messages.find((m) => m.id === messageId);
    if (msg) {
      msg.reactions[socket.id] = reaction;
      io.emit('message_reaction', { messageId, reactions: msg.reactions });
    }
  });

  // Read receipts
  socket.on('mark_read', (messageIds) => {
    messageIds.forEach((id) => {
      const msg = messages.find((m) => m.id === id);
      if (msg && !msg.readBy.includes(socket.id)) {
        msg.readBy.push(socket.id);
      }
    });
    io.emit('messages_read', messageIds);
  });

  // Handle pagination request
  socket.on('get_messages', ({ page }, callback) => {
    const paginated = getPaginatedMessages(page);
    callback(paginated);
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      user.online = false;
      io.emit('user_left', user);
      console.log(`${user.username} left the chat`);
      delete users[socket.id];
    }
    delete typingUsers[socket.id];
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
});

app.get('/', (req, res) => res.send('Socket.io Chat Server Running'));
app.get('/api/messages', (req, res) => res.json(messages));
app.get('/api/users', (req, res) => res.json(Object.values(users)));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
