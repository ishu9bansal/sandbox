import { Middleware } from '@reduxjs/toolkit';

const STORAGE_KEY = 'patient-management-state';

// Middleware to save state to localStorage on every change
export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save state to localStorage after action is processed
  if (typeof window !== 'undefined') {
    try {
      const state = store.getState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }
  
  return result;
};

// Load state from localStorage
export const loadStateFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return undefined;
  }
};
