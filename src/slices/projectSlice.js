import { createSlice } from '@reduxjs/toolkit';
import { saveState } from '../utils/localStorage';
import { findParentSubtask } from '../utils/findSubtask';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  projects: [],
};

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.push({
        name: action.payload.title,
        id: action.payload.id,
        tasks: []
      });
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
        project.name = action.payload.title;
      }
    },
    addTask: (state, action) => {
      const project = state.projects.find(project => project.id === action.payload.projectId);
      if (project) {
        project.tasks.push({
          id: uuidv4(),
          name: action.payload.taskName,
          done: false,
          subtasks: []
        });
      }
    },
    editTask: (state, action) => {
      const { projectId, taskId, newTitle } = action.payload;
      const project = state.projects.find(project => project.id === projectId);

      if (project) {
        const task = project.tasks.find(task => task.id === taskId);
        if (task) {
          task.name = newTitle;
          saveState(state);
        }
      }
    },
    deleteTask: (state, action) => {
      const project = state.projects.find(project => project.id === action.payload.projectId);
      if (project) {
        project.tasks = project.tasks.filter(task => task.id !== action.payload.taskId);
      }
      // const { projectId, taskId, subtaskId } = action.payload;

      // console.log(projectId);
      // console.log(taskId);
      // console.log(subtaskId);
      // const project = state.projects.find(project => project.id === projectId);
      // if (project) {
      //   const task = project.tasks.find(task => task.id === taskId);
      //   if (task) {
      //     const subtaskIndex = task.subtasks.findIndex(subtask => subtask.id === subtaskId);
      //     if (subtaskIndex !== -1) {
      //       task.subtasks.splice(subtaskIndex, 1);
      //     }
      //   }
      // }
    },
    markTaskDone: (state, action) => {
      const { projectId, taskId, done } = action.payload;
      const project = state.projects.find(project => project.id === projectId);
      if (project) {
        const task = project.tasks.find(task => task.id === taskId);
        if (task) {
          task.done = done;
        }
      }
    },
    markTaskForDeletion: (state, action) => {
      const { projectId, taskId, markForDeletion } = action.payload;
      const project = state.projects.find(project => project.id === projectId);
      if (project) {
        const task = project.tasks.find(task => task.id === taskId);
        if (task) {
          task.markedForDeletion = markForDeletion;
        }
      }
    },
    addSubtask: (state, action) => {
      const { projectId, taskId, subtask } = action.payload;
      const project = state.projects.find(project => project.id === projectId);
      if (project) {
        const task = project.tasks.find(task => task.id === taskId);
        if (task) {
          task.subtasks.push({
            id: uuidv4(),
            name: subtask.title,
            done: false,
            subtasks: []
          });
        } else {
          const parentSubtask = findParentSubtask(project.tasks, taskId);
          if (parentSubtask) {
            parentSubtask.subtasks.push({
              id: uuidv4(),
              name: subtask.title,
              done: false,
              subtasks: []
            });
          }
        }
      }
    },
    setSearchFilter: (state, action) => {
      state.searchFilter = action.payload;
    },
    dragTask: (state, action) => {
      const { sourceProjectId, destinationProjectId, sourceTaskIndex, destinationTaskIndex } = action.payload;
      const sourceProject = state.projects.find(project => project.id === sourceProjectId);
      const destinationProject = state.projects.find(project => project.id === destinationProjectId);
      if (sourceProject && destinationProject) {
        const [taskToMove] = sourceProject.tasks.splice(sourceTaskIndex, 1);
        destinationProject.tasks.splice(destinationTaskIndex, 0, taskToMove);
      }
    },
  },
});

export const {
  addProject,
  updateProjectTitle,
  deleteProject,
  setCurrentProject,
  updateProject,
  Title,
  addTask,
  deleteTask,
  markTaskDone,
  markTaskForDeletion,
  addSubtask,
  setSearchFilter,
  dragTask,
  editTask
} = projectSlice.actions;

export default projectSlice.reducer;