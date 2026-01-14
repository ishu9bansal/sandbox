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
export type InstrumentResponse = Record<string, Record<string, Record<string, Instrument[]>>>;
