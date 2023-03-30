import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  projects: [],
  // currentProjectId: uuidv4(),
};

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
    },
    setCurrentProject: (state, action) => {
      state.currentProjectId = action.payload;
    },
    updateProjectTitle: (state, action) => {
      const project = state.projects.find(project => project.id === action.payload.id);
      if (project) {
        project.title = action.payload.title;
      }
    },
  },
});

export const { addProject, deleteProject, setCurrentProject, updateProjectTitle } = projectSlice.actions;

export default projectSlice.reducer;