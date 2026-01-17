import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Instrument, PriceSnapshot, StraddleQuote, StraddleQuoteResponse } from '@/models/ticker';

interface TickerState {
  data: PriceSnapshot[];
  instruments: Instrument[];
  straddlePrices: Record<string, StraddleQuote[]>;
}

const initialState: TickerState = {
  data: [],
  instruments: [],
  straddlePrices: {},
};

const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    setLocalState: (state, action: PayloadAction<TickerState>) => {
      state = action.payload;
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
    setStraddlePrices: (state, action: PayloadAction<StraddleQuoteResponse>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        if (!state.straddlePrices[key]) {
          state.straddlePrices[key] = [];
        }
        state.straddlePrices[key].push(value);
      });
    },
  },
});

export const { setSnapshots, addSnapshots, clearData, setInstruments, clearInstruments, setLocalState, setStraddlePrices } = tickerSlice.actions;
export default tickerSlice.reducer;
export const selectTickerData = (state: { ticker: TickerState }) => state.ticker.data;
export const selectInstruments = (state: { ticker: TickerState }) => state.ticker.instruments;
