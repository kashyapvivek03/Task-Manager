const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from config.env
dotenv.config({ path: path.join(__dirname, 'config.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running' });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/task_manager";
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Starting server without MongoDB - using in-memory storage');
    return false;
  }
};

// In-memory storage for fallback
let inMemoryTasks = [];
let taskIdCounter = 1;

// Initialize database connection
let isMongoConnected = false;

const initializeServer = async () => {
  isMongoConnected = await connectDB();
  
  if (!isMongoConnected) {
    // Add fallback routes for when MongoDB is not available
    app.get('/api/tasks', (req, res) => {
      res.json(inMemoryTasks);
    });

    app.post('/api/tasks', (req, res) => {
      const task = {
        _id: taskIdCounter.toString(),
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || false,
        priority: req.body.priority || 'Medium',
        category: req.body.category || 'Others',
        dueDate: req.body.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      taskIdCounter++;
      inMemoryTasks.push(task);
      res.status(201).json(task);
    });

    app.put('/api/tasks/:id', (req, res) => {
      const taskIndex = inMemoryTasks.findIndex(task => task._id === req.params.id);
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      inMemoryTasks[taskIndex] = {
        ...inMemoryTasks[taskIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      res.json(inMemoryTasks[taskIndex]);
    });

    app.delete('/api/tasks/:id', (req, res) => {
      const taskIndex = inMemoryTasks.findIndex(task => task._id === req.params.id);
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      inMemoryTasks.splice(taskIndex, 1);
      res.json({ message: 'Task deleted' });
    });
  } else {
    // Routes (only used if MongoDB is connected)
    app.use('/api/tasks', require('./routes/tasks'));
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  // Handle 404 routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  const PORT = process.env.PORT || 5001;
  
  // Handle port conflicts
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`MongoDB connected: ${isMongoConnected ? 'Yes' : 'No (using in-memory storage)'}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
      server.listen(PORT + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

initializeServer();
