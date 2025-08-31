const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running - Test Mode' });
});

// Test tasks route
app.get('/api/tasks', (req, res) => {
  res.json([
    {
      _id: '1',
      title: 'Test Task',
      description: 'This is a test task',
      status: false,
      priority: 'Medium',
      category: 'Work',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
  console.log('Server is ready for testing!');
});
