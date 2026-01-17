import { PriceSnapshot, StraddleQuote, TickerState } from "@/models/ticker";

export function simulateStraddleQuotes(past_seconds: number): StraddleQuote[] {
  const quotes: StraddleQuote[] = [];
  const now = Date.now();
  for (let i = past_seconds; i > 0; i--) {
    const timestamp = now - i * 1000; // 1 second intervals
    quotes.push({
      quotes: [],
      timestamp,
      price: Math.random() * 100 + 100, // Random price between 100-200
    });
  }
  return quotes;
}

export function simulatePriceSnapshots(past_seconds: number): PriceSnapshot[] {
  const snapshots: PriceSnapshot[] = [];
  const now = Date.now();
  for (let i = past_seconds; i > 0; i--) {
    const timestamp = now - i * 1000;
    snapshots.push({
      timestamp,
      price: Math.random() * 1000 + 2000, // Random price between 2000-3000
      underlying: "NIFTY",
    });
  }
  return snapshots;
}

export function buildSimulatedState(past_seconds: number): TickerState {
  if (past_seconds == 0) {  // Clear state
    return {
      data: [],
      instruments: [],
      straddlePrices: {},
      liveTrackingIds: [],
    }
  }
  const snapshots = simulatePriceSnapshots(past_seconds);
  const straddleQuotes = simulateStraddleQuotes(past_seconds);
  return {
    data: snapshots,
    instruments: [],
    straddlePrices: {
      "SIMULATED_STRADDLE": straddleQuotes,
    },
    liveTrackingIds: ["SIMULATED_STRADDLE"],
  };
}
