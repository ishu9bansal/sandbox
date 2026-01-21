import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Instrument, LiveQuote, LiveQuoteResponse, TickerState } from '@/models/ticker';

const initialState: TickerState = {
  instruments: [],
  liveTrackingIds: [],
  liveQuotes: {},
};

const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    setLiveQuotes: (state, action: PayloadAction<Record<string, LiveQuote[]>>) => {
      state.liveQuotes = action.payload;
    },
    setInstruments: (state, action: PayloadAction<Instrument[]>) => {
      state.instruments = action.payload;
    },
    addLiveQuote: (state, action: PayloadAction<LiveQuoteResponse>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        if (!state.liveQuotes[key]) {
          state.liveQuotes[key] = [];
        }
        state.liveQuotes[key].push(value);
      });
    },
    clearInstruments: (state) => {
      state.instruments = [];
    },
    setLiveTrackingIds: (state, action: PayloadAction<string[]>) => {
      state.liveTrackingIds = action.payload;
    },
  },
});

export const {
  setLiveQuotes,
  setInstruments,
  clearInstruments,
  setLiveTrackingIds,
  addLiveQuote,
} = tickerSlice.actions;
export default tickerSlice.reducer;
export const selectInstruments = (state: { ticker: TickerState }) => state.ticker.instruments;
export const selectLiveTrackingIds = (state: { ticker: TickerState }) => state.ticker.liveTrackingIds;
export const selectLiveQuotes = (state: { ticker: TickerState }) => state.ticker.liveQuotes;
