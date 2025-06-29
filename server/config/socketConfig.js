// server/config/socketConfig.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

// Initialize Socket.IO server
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email; // Assuming email is part of the token payload      
      console.log(`User ${socket.userEmail} connected with socket ID: ${socket.id}`);
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} for user: ${socket.userEmail}`);
    
    // Join user to their personal room
    socket.join(`user_${socket.userId}`);
    
    // Join user to general room (for broadcast messages)
    socket.join('general');

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
    });

    // Handle custom events (you can add more as needed)
    socket.on('join_room', (roomName) => {
      socket.join(roomName);
      console.log(`User ${socket.userEmail} joined room: ${roomName}`);
    });

    socket.on('leave_room', (roomName) => {
      socket.leave(roomName);
      console.log(`User ${socket.userEmail} left room: ${roomName}`);
    });
  });

  return io;
};

// Get the socket instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized! Make sure to call initSocket first.');
  }
  return io;
};

// Generalized emit functions
const emitToUser = (userId, event, data) => {
  const socketIO = getIO();
  socketIO.to(`user_${userId}`).emit(event, data);
  console.log(`Emitted ${event} to user ${userId}:`, data);
};

const emitToRoom = (roomName, event, data) => {
  const socketIO = getIO();
  socketIO.to(roomName).emit(event, data);
  console.log(`Emitted ${event} to room ${roomName}:`, data);
};

const emitToAll = (event, data) => {
  const socketIO = getIO();
  socketIO.emit(event, data);
  console.log(`Broadcasted ${event} to all users:`, data);
};

// Specific resume-related emit functions
const emitResumeCreated = (userId, resumeData) => {
  emitToUser(userId, 'resume_created', {
    type: 'resume_created',
    data: resumeData,
    timestamp: new Date().toISOString(),
    message: 'Resume created successfully!'
  });
};

const emitResumeUpdated = (userId, resumeData) => {
  emitToUser(userId, 'resume_updated', {
    type: 'resume_updated',
    data: resumeData,
    timestamp: new Date().toISOString(),
    message: 'Resume updated successfully!'
  });
};

const emitResumeDeleted = (userId, resumeId) => {
  emitToUser(userId, 'resume_deleted', {
    type: 'resume_deleted',
    data: { resumeId },
    timestamp: new Date().toISOString(),
    message: 'Resume deleted successfully!'
  });
};

// Generic notification function (for future use)
const emitNotification = (userId, notification) => {
  emitToUser(userId, 'notification', {
    type: 'notification',
    data: notification,
    timestamp: new Date().toISOString()
  });
};

const emitStatsDashboard = (userId, statsData) => {
  emitToUser(userId, 'stats_dashboard', {
    type: 'stats_dashboard',
    data: statsData,
    timestamp: new Date().toISOString()
  });
};

const emitPreferencesDashboard = (userId, preferencesData) => {
  emitToUser(userId, 'preferences_dashboard', {
    type: 'preferences_dashboard',
    data: preferencesData,
    timestamp: new Date().toISOString()
  });
};
const emitPostCreated = (userId, postData) => {
  emitToUser(userId, 'post_created', {
    type: 'post_created',
    data: postData,
    timestamp: new Date().toISOString()
  });
};

const emitEmailCreated = (userId, emailData) => {
  emitToUser(userId, 'email_created', {
    type: 'email_created',
    data: emailData,
    timestamp: new Date().toISOString()
  });
};


const emitEmailSent = (userId, emailData) => {
  emitToUser(userId, 'email_sent', {
    type: 'email_sent',
    data: emailData,
    timestamp: new Date().toISOString()
  });
};

export {
  initSocket,
  getIO,
  emitToUser,
  emitToRoom,
  emitToAll,
  emitResumeCreated,
  emitResumeUpdated,
  emitResumeDeleted,
  emitNotification,
  emitStatsDashboard,
  emitPreferencesDashboard,
  emitPostCreated,
  emitEmailCreated,
  emitEmailSent
};