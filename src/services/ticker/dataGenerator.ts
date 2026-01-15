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