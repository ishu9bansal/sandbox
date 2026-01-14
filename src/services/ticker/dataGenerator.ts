import type { PremiumSnapshot } from "@/models/ticker";

/**
 * Generate realistic intraday straddle premium data
 * This simulates the behavior of option premiums throughout the trading day
 */
export class StraddleDataGenerator {
  private baseSpotPrice: number;
  private currentTime: Date;
  private marketOpenTime: Date;
  private dataPoints: PremiumSnapshot[];
  private volatility: number;
  private trendDirection: number;

  constructor(baseSpotPrice = 19750) {
    this.baseSpotPrice = baseSpotPrice;
    
    // Set market open time to 9:15 AM
    this.marketOpenTime = new Date();
    this.marketOpenTime.setHours(9, 15, 0, 0);
    
    this.currentTime = new Date(this.marketOpenTime);
    this.dataPoints = [];
    this.volatility = 0.002; // 0.2% price movement volatility
    this.trendDirection = Math.random() > 0.5 ? 1 : -1;
  }

  /**
   * Calculate premium for a given strike offset
   * Premiums decay over time and are affected by spot price movement
   */
  private calculatePremium(
    strikeOffset: number,
    _spotPrice: number,
    timeElapsed: number
  ): number {
    const atmPremium = 230; // Base ATM premium
    
    // Time decay factor (premiums decay throughout the day)
    const timeDecayFactor = 1 - (timeElapsed / (6.25 * 60 * 60 * 1000)) * 0.3; // 30% decay by market close
    
    // Distance from ATM affects premium
    const distanceFactor = Math.exp(-Math.abs(strikeOffset) * 0.15);
    
    // Add some randomness for realistic movement
    const randomFactor = 1 + (Math.random() - 0.5) * 0.05;
    
    // Calculate base premium
    let premium = atmPremium * distanceFactor * timeDecayFactor * randomFactor;
    
    // OTM strikes have different premium behavior
    if (strikeOffset !== 0) {
      const otmAdjustment = 1 + Math.abs(strikeOffset) * 0.08;
      premium *= otmAdjustment;
    }
    
    return Math.round(premium * 100) / 100;
  }

  /**
   * Generate the next data snapshot
   */
  generateNextSnapshot(): PremiumSnapshot {
    // Calculate time elapsed since market open
    const timeElapsed = this.currentTime.getTime() - this.marketOpenTime.getTime();
    
    // Generate spot price movement (random walk with slight trend)
    const priceChange = (Math.random() - 0.5) * this.baseSpotPrice * this.volatility * 2;
    const trendChange = this.trendDirection * this.baseSpotPrice * 0.0001;
    const spotPrice = this.baseSpotPrice + priceChange + trendChange;
    
    // Occasionally change trend direction
    if (Math.random() < 0.05) {
      this.trendDirection *= -1;
    }
    
    // Update base spot price slightly (slow drift)
    this.baseSpotPrice = spotPrice;
    
    // Generate premiums for all strikes
    const snapshot: PremiumSnapshot = {
      timestamp: this.currentTime.getTime(),
      spotPrice: Math.round(spotPrice * 100) / 100,
      premiums: {
        '-3': this.calculatePremium(-3, spotPrice, timeElapsed),
        '-2': this.calculatePremium(-2, spotPrice, timeElapsed),
        '-1': this.calculatePremium(-1, spotPrice, timeElapsed),
        '0': this.calculatePremium(0, spotPrice, timeElapsed),
        '1': this.calculatePremium(1, spotPrice, timeElapsed),
        '2': this.calculatePremium(2, spotPrice, timeElapsed),
        '3': this.calculatePremium(3, spotPrice, timeElapsed),
      },
    };
    
    // Advance time by 5 seconds
    this.currentTime = new Date(this.currentTime.getTime() + 5000);
    
    this.dataPoints.push(snapshot);
    return snapshot;
  }

  /**
   * Generate initial historical data (last 30 minutes)
   */
  generateInitialData(pointCount = 360): PremiumSnapshot[] {
    const data: PremiumSnapshot[] = [];
    
    for (let i = 0; i < pointCount; i++) {
      data.push(this.generateNextSnapshot());
    }
    
    return data;
  }

  generateFullDayData(): PremiumSnapshot[] {
    const totalPoints = (6.25 * 60 * 60) / 5; // Total points in a trading day (5 sec intervals)
    return this.generateInitialData(totalPoints);
  }

  /**
   * Reset the simulator
   */
  reset(baseSpotPrice?: number): void {
    if (baseSpotPrice) {
      this.baseSpotPrice = baseSpotPrice;
    }
    this.currentTime = new Date(this.marketOpenTime);
    this.dataPoints = [];
    this.trendDirection = Math.random() > 0.5 ? 1 : -1;
  }
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