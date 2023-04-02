import { createSlice } from '@reduxjs/toolkit';
import { saveState } from '../utils/localStorage';
import { findParentSubtask } from '../utils/findSubtask';
import { findTaskById, setTaskDone } from '../utils/findTaskById';
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

        // Check if the task to edit is a subtask
        let editedInSubtasks = false;
        for (let i = 0; i < project.tasks.length; i++) {
          const task = project.tasks[i];
          if (editInSubtasks(task.subtasks)) {
            editedInSubtasks = true;
            break;
          }
        }

        // If it's not a subtask, edit it in the parent task's tasks array
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

        // Check if the task to delete is a subtask
        let deletedFromSubtasks = false;
        for (let i = 0; i < project.tasks.length; i++) {
          const task = project.tasks[i];
          if (deleteFromSubtasks(task.subtasks)) {
            deletedFromSubtasks = true;
            break;
          }
        }

        // If it's not a subtask, delete it from the parent task's tasks array
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

        // If it's not a subtask, mark it as done in the parent task's tasks array
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
  addSubtask,
  setSearchFilter,
  dragTask,
  editTask
} = projectSlice.actions;

export default projectSlice.reducer;