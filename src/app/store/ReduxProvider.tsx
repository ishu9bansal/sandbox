"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect } from 'react';
import { setPatients } from './patientSlice';
import { loadStateFromLocalStorage } from './localStorage';

export default function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Load state from localStorage when the app initializes
    const savedState = loadStateFromLocalStorage();
    if (savedState && savedState.patients && savedState.patients.patients) {
      store.dispatch(setPatients(savedState.patients.patients));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
