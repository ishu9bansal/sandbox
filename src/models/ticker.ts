// Type definitions for Straddle Premium Visualization

export interface PremiumSnapshot {
  timestamp: number; // milliseconds since epoch
  spotPrice: number;
  premiums: {
    '-3': number;
    '-2': number;
    '-1': number;
    '0': number;  // ATM
    '1': number;
    '2': number;
    '3': number;
  };
}

export interface PriceSnapshot {
  price: number;
  timestamp: number;
  underlying: string;
}

export type Instrument = {
  instrument_token: number;
  exchange_token: string;
  tradingsymbol: string;
  name: string;
  last_price: number;
  expiry: string;
  strike: number;
  tick_size: number;
  lot_size: number;
  instrument_type: string;
  segment: string;
  exchange: string;
};

// map of underlying -> instrument type -> expiry -> list of instruments
export type InstrumentResponse = Instrument[];

type InsrumentRef = string;
type OHLC = {
  open: number;
  high: number;
  low: number;
  close: number;
};
export type Quote = {
  instrument_token: number;
  tradingsymbol: string;
  timestamp: string;
  last_price: number;
  net_change: number;
  ohlc: OHLC;
};
export type QuoteResponse = Record<InsrumentRef, Quote>;

export type Straddle = {
  underlying: string;
  strike: number;
  expiry: string;
  call: Instrument;
  put: Instrument;
};
export type StraddleResponse = Straddle[];
