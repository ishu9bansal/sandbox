import { PriceSnapshot, LiveQuote, TickerState } from "@/models/ticker";

export function simulateStraddleQuotes(id: string, past_seconds: number): LiveQuote[] {
  const quotes: LiveQuote[] = [];
  const now = Date.now();
  for (let i = past_seconds; i > 0; i--) {
    const timestamp = now - i * 1000; // 1 second intervals
    quotes.push({
      id,
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
  let price = 19750 + (Math.random() - 0.5) * 500; // Start around 19750 +/- 250
  for (let i = past_seconds; i > 0; i--) {
    price *= volFac(0.001); // 0.1% volatility
    snapshots.push({
      price,
      timestamp: now - i * 1000, // 1 second intervals
      underlying: "NIFTY",
    });
  }
  return snapshots;
}

export function buildSimulatedState(past_seconds: number, straddleCount: number = 3): Partial<TickerState> {
  if (past_seconds == 0) {  // Clear state
    return {
      data: [],
      straddlePrices: {},
    }
  }
  const snapshots = simulatePriceSnapshots(past_seconds);
  const straddlePrices = Object.fromEntries(Array.from({ length: straddleCount }, (_, i) => 
    ([`STRADDLE_${i + 1}`, simulateStraddleQuotes(`STRADDLE_${i + 1}`, past_seconds)])
  ));
  const liveTrackingIds = Object.keys(straddlePrices);
  return {
    data: snapshots,
    straddlePrices: straddlePrices,
    liveTrackingIds,
  };
}

export class PriceGenerator {
  private timeOffset: number = 0;
  constructor(private basePrice: number = 19750, private volatility: number = 0.002) {
    const now = new Date();
    if (now.getHours() >= 15 && now.getMinutes() >= 30) {
      now.setHours(10, 0, 0, 0);  // 10 AM same day
      this.timeOffset = now.getTime() - new Date().getTime();
    }
  }
  generateNextPrice(): { price: number; timestamp: number; underlying: string; } {
    const priceChange = (Math.random() - 0.5) * this.basePrice * this.volatility * 2;
    const trendChange = (Math.random() - 0.5) * this.basePrice * 0.0001 * 2;
    const spotPrice = this.basePrice + priceChange + trendChange;
    this.basePrice = spotPrice;
    const price = Math.round(spotPrice * 100) / 100;
    const timestamp = new Date().getTime() + this.timeOffset;
    return { price, timestamp, underlying: 'NIFTY'}
  }
}

export function volFac(vol: number = 0.002): number {
  return (1 + (Math.random() - 0.5) * vol * 2);
}
