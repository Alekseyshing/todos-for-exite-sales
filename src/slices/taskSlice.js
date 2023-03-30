import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleDone: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.done = !task.done;
      }
    },
    editTask: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
      }
    },
    addSubtask: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.subtasks.push(action.payload.subtask);
      }
    },
    deleteSubtask: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.taskId);
      if (task) {
        task.subtasks = task.subtasks.filter(
          (subtask) => subtask.id !== action.payload.subtaskId
        );
      }
    },
    toggleSubtaskDone: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.taskId);
      if (task) {
        const subtask = task.subtasks.find(
          (subtask) => subtask.id === action.payload.subtaskId
        );
        if (subtask) {
          subtask.done = !subtask.done;
        }
      }
    },
    editSubtask: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.taskId);
      if (task) {
        const subtask = task.subtasks.find(
          (subtask) => subtask.id === action.payload.subtaskId
        );
        if (subtask) {
          subtask.title = action.payload.title;
        }
      }
    },
  },
});

export const {
  addTask,
  deleteTask,
  toggleDone,
  editTask,
  addSubtask,
  deleteSubtask,
  toggleSubtaskDone,
  editSubtask,
} = taskSlice.actions;

export default taskSlice.reducer;
