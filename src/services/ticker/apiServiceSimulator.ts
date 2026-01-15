import type { PremiumSnapshot } from "@/models/ticker";
import { StraddleAccessor } from "./straddleDataAccessor";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class StraddleDataSimulator {
  private accessor: StraddleAccessor;
  private offsetNow: number;

  constructor(now: Date = new Date()) {
    this.offsetNow = now.getTime() - (new Date()).getTime();
    this.accessor = new StraddleAccessor();
  }

  getCurrentTimestamp(): number {
    // simulation time = real time + offset
    return (new Date()).getTime() + this.offsetNow;
  }

  async fetchDeltaData(lastTimestamp: number | null): Promise<PremiumSnapshot[]> {
    // lastTimestamp: recieves last fetched timestamp in client data (simulation time)
    await sleep(500); // Simulate network delay

    const simulationNow = this.getCurrentTimestamp();
    return this.accessor.getDataInRange(lastTimestamp, simulationNow);
  }

};
