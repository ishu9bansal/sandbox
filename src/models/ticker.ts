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
