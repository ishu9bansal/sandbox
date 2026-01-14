import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PremiumSnapshot } from '@/models/ticker';

interface TickerState {
  data: PremiumSnapshot[];
}

const initialState: TickerState = {
  data: [],
};

const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<PremiumSnapshot[]>) => {
      state.data = action.payload;
    },
    addSnapshots: (state, action: PayloadAction<PremiumSnapshot[]>) => {
      state.data = state.data.concat(action.payload);
    },
    clearData: (state) => {
      state.data = [];
    },
  },
});

export const { setData, addSnapshots, clearData } = tickerSlice.actions;
export default tickerSlice.reducer;
export const selectTickerData = (state: { ticker: TickerState }) => state.ticker.data;
