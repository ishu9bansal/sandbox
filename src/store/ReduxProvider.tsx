"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect } from 'react';
import { setPatients } from './slices/patientSlice';
import { loadStateFromLocalStorage } from './localStorage';
import { setPerioRecords } from './slices/perioSlice';
import { setLiveQuotes, setLiveTrackingIds } from './slices/tickerSlice';

export default function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Load state from localStorage when the app initializes
    const savedState = loadStateFromLocalStorage();
    if (savedState?.patients?.patients) {
      store.dispatch(setPatients(savedState.patients.patients));
    }
    if (savedState?.perio?.records) {
      store.dispatch(setPerioRecords(savedState.perio.records));
    }
    if (savedState?.ticker?.liveTrackingIds) {
      store.dispatch(setLiveTrackingIds(savedState.ticker.liveTrackingIds));
    }
    if (savedState?.ticker?.liveQuotes) {
      store.dispatch(setLiveQuotes(savedState.ticker.liveQuotes));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
