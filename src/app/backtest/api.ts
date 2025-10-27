import { type BacktestFormData, BacktestResult } from "./types";

const BACKTEST_API_BASE = "https://ej5u3yy5de.execute-api.us-east-1.amazonaws.com";
const USER_AGENT = "backtest-visualizer-app/1.0";

export async function makeBacktestRequest(strategy: BacktestFormData): Promise<BacktestResult | null> {
    try {
        const response = await fetch(`${BACKTEST_API_BASE}/backtest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": USER_AGENT,
            },
            body: JSON.stringify(strategy),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as BacktestResult;
    } catch (error) {
        console.error("Error making backtest request:", error);
        return null;
    }
}
