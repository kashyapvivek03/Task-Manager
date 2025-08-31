import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { fetchTasks, addTask, toggleTask, deleteTask } from './features/tasksSlice';
import './App.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  priority: 'Low' | 'Medium' | 'High';
  category: 'Personal' | 'Work' | 'Shopping' | 'Others';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: tasks, status, error } = useSelector((state: RootState) => state.tasks);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [category, setCategory] = useState<'Personal' | 'Work' | 'Shopping' | 'Others'>('Others');
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Personal' | 'Work' | 'Shopping' | 'Others'>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const filterTasks = (tasks: Task[]) => {
    return tasks
      .filter(task => {
        const matchesSearch = 
          (task.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (task.description?.toLowerCase() || '').includes(search.toLowerCase());
        const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
        const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
        
        return matchesSearch && matchesPriority && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (sortBy === 'priority') {
          const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
          return priorityOrder[a.priority || 'Low'] - priorityOrder[b.priority || 'Low'];
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      await dispatch(addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate: dueDate || undefined
      })).unwrap();
      
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setCategory('Others');
    } catch (error: any) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const handleToggleTask = async (id: string, currentStatus: boolean) => {
    try {
      await dispatch(toggleTask({ id, status: !currentStatus })).unwrap();
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="container">
        <header className="header">
          <h1 className="title">Task Manager</h1>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>
        
        <div className="add-task-section">
          <h2 className="section-title">Add New Task</h2>
          <form onSubmit={handleAddTask} className="task-form">
            <div className="form-row">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="form-input"
                required
              />
            </div>
            <div className="form-row">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                className="form-textarea"
              />
            </div>
            <div className="form-row form-controls">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                className="form-select"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'Personal' | 'Work' | 'Shopping' | 'Others')}
                className="form-select"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Shopping">Shopping</option>
                <option value="Others">Others</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
                placeholder="Deadline"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>
        </div>

        <div className="filter-section">
          <h2 className="section-title">Filter Tasks</h2>
          <div className="filter-grid">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="filter-input"
            />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as 'All' | 'Low' | 'Medium' | 'High')}
              className="filter-select"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as 'All' | 'Personal' | 'Work' | 'Shopping' | 'Others')}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'createdAt')}
              className="filter-select"
            >
              <option value="createdAt">Sort by Created Date</option>
              <option value="dueDate">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>

        <div className="tasks-section">
          <h2 className="section-title">Your Tasks ({filterTasks(tasks).length})</h2>
          {filterTasks(tasks).length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Try adjusting your filters or add a new task!</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filterTasks(tasks).map(task => (
                <div
                  key={task._id}
                  className={`task-card ${task.status ? 'completed' : ''}`}
                >
                  <div className="task-header">
                    <div className="task-checkbox">
                      <input
                        type="checkbox"
                        checked={task.status}
                        onChange={() => handleToggleTask(task._id, task.status)}
                        className="checkbox"
                      />
                      <span className="task-title">
                        {task.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="btn btn-danger"
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-tags">
                    <span className={`tag priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className="tag category">
                      {task.category}
                    </span>
                    {task.dueDate && (
                      <span className={`tag due-date ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
                        Deadline: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;