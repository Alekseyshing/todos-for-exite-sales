import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../slices/projectSlice';
import { loadState, saveState } from '../utils/localStorage';

const persistedState = loadState();

const store = configureStore({
  reducer: {
    projects: projectReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    projects: store.getState().projects,
  });
});

export default store;