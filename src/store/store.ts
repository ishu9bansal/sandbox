import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import tickerReducer from './slices/tickerSlice';
import perioReducer from './slices/perioSlice';
import { localStorageMiddleware } from './localStorage';

export const store = configureStore({
  reducer: {
    patients: patientReducer,
    ticker: tickerReducer,
    perio: perioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
