import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Instrument, PriceSnapshot, LiveQuote, LiveQuoteResponse, TickerState } from '@/models/ticker';

const initialState: TickerState = {
  data: [],
  instruments: [],
  straddlePrices: {},
  liveTrackingIds: [],
};

const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    setLocalState: (state, action: PayloadAction<Partial<TickerState>>) => {
      state.data = action.payload.data || state.data;
      state.instruments = action.payload.instruments || state.instruments;
      state.straddlePrices = action.payload.straddlePrices || state.straddlePrices;
      state.liveTrackingIds = action.payload.liveTrackingIds || state.liveTrackingIds;
    },
    setSnapshots: (state, action: PayloadAction<PriceSnapshot[]>) => {
      state.data = action.payload;
    },
    setInstruments: (state, action: PayloadAction<Instrument[]>) => {
      state.instruments = action.payload;
    },
    addSnapshots: (state, action: PayloadAction<PriceSnapshot[]>) => {
      state.data = state.data.concat(action.payload);
    },
    clearData: (state) => {
      state.data = [];
    },
    clearInstruments: (state) => {
      state.instruments = [];
    },
    setStraddlePrices: (state, action: PayloadAction<LiveQuoteResponse>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        if (!state.straddlePrices[key]) {
          state.straddlePrices[key] = [];
        }
        state.straddlePrices[key].push(value);
      });
    },
    setLiveTrackingIds: (state, action: PayloadAction<string[]>) => {
      state.liveTrackingIds = action.payload;
    },
  },
});

export const {
  setSnapshots,
  addSnapshots,
  clearData,
  setInstruments,
  clearInstruments,
  setLocalState,
  setStraddlePrices,
  setLiveTrackingIds,
} = tickerSlice.actions;
export default tickerSlice.reducer;
export const selectTickerData = (state: { ticker: TickerState }) => state.ticker.data;
export const selectInstruments = (state: { ticker: TickerState }) => state.ticker.instruments;
export const selectLiveTrackingIds = (state: { ticker: TickerState }) => state.ticker.liveTrackingIds;
export const selectStraddleData = (ids: string[]) => (state: { ticker: TickerState }) => {
  const result: Record<string, LiveQuote[]> = {};
  ids.forEach(id => {
    result[id] = state.ticker.straddlePrices[id] || [];
  });
  return result;
};
