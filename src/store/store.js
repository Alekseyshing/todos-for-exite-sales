import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../slices/projectSlice';
import taskReducer from '../slices/taskSlice';
import { loadState, saveState } from '../utils/localStorage';

const persistedState = loadState();

const store = configureStore({
  reducer: {
    projects: projectReducer,
    tasks: taskReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    projects: store.getState().projects,
    tasks: store.getState().tasks,
  });
});

export default store;