# Task Management System

A full-stack task management application built with React, TypeScript, Redux Toolkit, Node.js, Express, and MongoDB.

## Features

- ✅ Create, read, update, and delete tasks
- ✅ Task priority levels (Low, Medium, High)
- ✅ Task categories (Personal, Work, Shopping, Others)
- ✅ Due date assignment
- ✅ Task completion status
- ✅ Search and filter tasks
- ✅ Sort tasks by different criteria
- ✅ Responsive design
- ✅ Real-time state management with Redux

## Tech Stack

### Frontend
- React 19
- TypeScript
- Redux Toolkit
- Axios for API calls
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled
- Environment variables support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd task_manager
```

### 2. Install dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd server
npm install
```

### 3. Configure MongoDB

1. Create a MongoDB Atlas account or use local MongoDB
2. Update the `server/config.env` file with your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

### 4. Run the application

#### Start the backend server
```bash
cd server
npm start
# or for development with auto-restart
npm run dev
```

#### Start the frontend application
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Usage

1. **Adding Tasks**: Fill out the form with task title, description, priority, category, and optional due date
2. **Managing Tasks**: 
   - Check/uncheck the checkbox to mark tasks as complete
   - Click the delete button to remove tasks
3. **Filtering**: Use the search bar and filter dropdowns to find specific tasks
4. **Sorting**: Choose how to sort your tasks (by creation date, due date, or priority)

## Project Structure

```
task_manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── features/       # Redux slices
│   │   ├── store.ts        # Redux store configuration
│   │   └── App.tsx         # Main application component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── config.env          # Environment variables
│   ├── server.js           # Express server
│   └── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: 
   - Check your connection string in `config.env`
   - Ensure your IP is whitelisted in MongoDB Atlas

2. **Port Already in Use**:
   - Change the PORT in `config.env` or kill the process using the port

3. **CORS Errors**:
   - The server is configured with CORS, but if you change the frontend port, update the CORS configuration

### Development

- The backend uses nodemon for auto-restart during development
- Frontend has hot reload enabled
- Check the browser console and server logs for debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
