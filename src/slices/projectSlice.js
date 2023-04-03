import { createSlice } from '@reduxjs/toolkit';
import { saveState } from '../utils/localStorage';
import { findParentSubtask } from '../utils/findSubtask';
import { uuidv4 } from 'uuid';

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
    updateProjects(state, action) {
      state.projects = action.payload;
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
        const editInSubtasks = (subtasks) => {
          for (let i = 0; i < subtasks.length; i++) {
            if (subtasks[i].id === taskId) {
              subtasks[i].name = newTitle;
              return true;
            } else if (subtasks[i].subtasks && editInSubtasks(subtasks[i].subtasks)) {
              return true;
            }
          }
          return false;
        };

        let editedInSubtasks = false;
        for (let i = 0; i < project.tasks.length; i++) {
          const task = project.tasks[i];
          if (editInSubtasks(task.subtasks)) {
            editedInSubtasks = true;
            break;
          }
        }

        if (!editedInSubtasks) {
          const taskToEdit = project.tasks.find(task => task.id === taskId);
          if (taskToEdit) {
            taskToEdit.name = newTitle;
            saveState(state);
          }
        }
      }
    },
    deleteTask: (state, action) => {
      const { projectId, taskId } = action.payload;
      const project = state.projects.find(project => project.id === projectId);

      if (project) {
        const deleteFromSubtasks = (subtasks) => {
          for (let i = 0; i < subtasks.length; i++) {
            if (subtasks[i].id === taskId) {
              subtasks.splice(i, 1);
              return true;
            } else if (subtasks[i].subtasks && deleteFromSubtasks(subtasks[i].subtasks)) {
              return true;
            }
          }
          return false;
        };

        let deletedFromSubtasks = false;
        for (let i = 0; i < project.tasks.length; i++) {
          const task = project.tasks[i];
          if (deleteFromSubtasks(task.subtasks)) {
            deletedFromSubtasks = true;
            break;
          }
        }

        if (!deletedFromSubtasks) {
          project.tasks = project.tasks.filter(task => task.id !== taskId);
        }
      }
    },
    markTaskDone: (state, action) => {
      const { projectId, taskId, done } = action.payload;
      const project = state.projects.find(project => project.id === projectId);

      if (project) {
        const markInSubtasks = (subtasks) => {
          for (let i = 0; i < subtasks.length; i++) {
            if (subtasks[i].id === taskId) {
              subtasks[i].done = done;
              return true;
            } else if (subtasks[i].subtasks && markInSubtasks(subtasks[i].subtasks)) {
              return true;
            }
          }
          return false;
        };

        // Check if the task to mark as done is a subtask
        let markedInSubtasks = false;
        for (let i = 0; i < project.tasks.length; i++) {
          const task = project.tasks[i];
          if (markInSubtasks(task.subtasks)) {
            markedInSubtasks = true;
            break;
          }
        }

        if (!markedInSubtasks) {
          const task = project.tasks.find(task => task.id === taskId);
          if (task) {
            task.done = done;
          }
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
  },
});

export const {
  addProject,
  updateProjectTitle,
  deleteProject,
  updateProjects,
  setCurrentProject,
  updateProject,
  Title,
  addTask,
  deleteTask,
  markTaskDone,
  addSubtask,
  setSearchFilter,
  editTask
} = projectSlice.actions;

export default projectSlice.reducer;