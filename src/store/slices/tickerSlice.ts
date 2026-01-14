import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Instrument, PremiumSnapshot } from '@/models/ticker';

interface TickerState {
  data: PremiumSnapshot[];
  instruments: Instrument[];
}

const initialState: TickerState = {
  data: [],
  instruments: [],
};

const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<PremiumSnapshot[]>) => {
      state.data = action.payload;
    },
    setInstruments: (state, action: PayloadAction<Instrument[]>) => {
      state.instruments = action.payload;
    },
    addSnapshots: (state, action: PayloadAction<PremiumSnapshot[]>) => {
      state.data = state.data.concat(action.payload);
    },
    clearData: (state) => {
      state.data = [];
    },
    clearInstruments: (state) => {
      state.instruments = [];
    },
  },
});

export const { setData, addSnapshots, clearData, setInstruments, clearInstruments } = tickerSlice.actions;
export default tickerSlice.reducer;
export const selectTickerData = (state: { ticker: TickerState }) => state.ticker.data;
export const selectInstruments = (state: { ticker: TickerState }) => state.ticker.instruments;
