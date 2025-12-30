import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './patientSlice';
import perioReducer from './perioSlice';
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
