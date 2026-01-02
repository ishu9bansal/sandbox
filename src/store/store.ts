import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import perioReducer from './slices/perioSlice';
import { localStorageMiddleware } from './localStorage';

export const store = configureStore({
  reducer: {
    patients: patientReducer,
    perio: perioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
