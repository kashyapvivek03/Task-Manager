import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/tasks';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task: { 
    title: string; 
    description: string; 
    priority: 'Low' | 'Medium' | 'High';
    category: 'Personal' | 'Work' | 'Shopping' | 'Others';
    dueDate?: string;
  }) => {
    const response = await axios.post(API_URL, task);
    return response.data;
  }
);

export const toggleTask = createAsyncThunk(
  'tasks/toggleTask',
  async ({ id, status }: { id: string; status: boolean }) => {
    const response = await axios.put(`${API_URL}/${id}`, { status });
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

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

interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
