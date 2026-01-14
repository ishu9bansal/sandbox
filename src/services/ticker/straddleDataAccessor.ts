import type { PremiumSnapshot } from "@/models/ticker";
import { StraddleDataGenerator } from "./dataGenerator";
import { loadStraddleData, saveStraddleData } from "./localStorage";

export class StraddleAccessor {
  private data: PremiumSnapshot[] = [];
  private straddleDataGenerator: StraddleDataGenerator;

  constructor() {
    this.straddleDataGenerator = new StraddleDataGenerator();
    this.data = loadStraddleData();
    if (this.data.length === 0) {
      this.resetStraddleData();
    }
  }
  resetStraddleData(): void {
    this.straddleDataGenerator.reset(19750);
    this.data = this.straddleDataGenerator.generateFullDayData();
    saveStraddleData(this.data);
  }
  getDataInRange(startTime: number | null, endTime: number | null): PremiumSnapshot[] {
    if (startTime === null && endTime === null) {
      return this.data;
    }
    if (startTime === null) {
      startTime = this.data[0].timestamp;
    }
    if (endTime === null) {
      endTime = this.data[this.data.length - 1].timestamp;
    }
    return this.data.filter(
      (snapshot) =>
        snapshot.timestamp >= startTime && snapshot.timestamp <= endTime
    );
  }
};
