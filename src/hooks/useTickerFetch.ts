import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addSnapshots, selectInstruments, selectTickerData, setInstruments } from "@/store/slices/tickerSlice";
import { HealthClient, TickerClient } from "@/services/ticker/tickerClient";
import { BASE_URL } from "@/services/ticker/constants";
import { Instrument, InstrumentResponse, PriceSnapshot, Quote } from "@/models/ticker";

const tickerClient = new TickerClient({ baseURL: BASE_URL });
export function useInstruments() {
  const instruments = useAppSelector(selectInstruments);
  const dispatch = useAppDispatch();
  const reload = useCallback(async () => {
    try {
      const instrumentMap = await tickerClient.getInstruments();
      if (!instrumentMap) {
        throw new Error("No instruments received");
      }
      const instruments = listFromMap(instrumentMap);
      dispatch(setInstruments(instruments));
    } catch (error) {
      console.error(error);
      // Handle error appropriately, e.g., show notification to user
    }
  }, []);
  useEffect(() => {
    reload();
  }, [])
  return { reload, instruments };
}

export function useLiveData(interval: number = 1000) {
  const data = useAppSelector(selectTickerData);
  const dispatch = useAppDispatch();
  useEffect(() => {
    let isMounted = true;
    const fetchQuote = async () => {
      try {
        const underlying = 'NIFTY';
        const { timestamp, quote } = await tickerClient.getQuote(underlying);
        if (!quote) {
          throw new Error("No quote received");
        }
        const snapshot = snapshotFromQuote(timestamp, quote, underlying);
        if (!isMounted) return;
        dispatch(addSnapshots([snapshot]));
      } catch (error) {
        console.error(error);
        // Handle error appropriately, e.g., show notification to user
      }
    };
    fetchQuote();
    const intervalId = setInterval(fetchQuote, interval); // Check every seconds
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [interval]);
  return { data };
}

function snapshotFromQuote(timestamp: number, quote: Quote | null, underlying: string): PriceSnapshot {
  const price = quote?.last_price;
  if (price === undefined || price === null) {
    throw new Error("Invalid quote data");
  }
  return { underlying, timestamp, price };
}

function listFromMap(instrumentMap: InstrumentResponse): Instrument[] {
  return Object.values(instrumentMap).map((instGroup) => {
    return Object.values(instGroup).map((instGroup2) => {
      return Object.values(instGroup2).flat();
    }).flat();
  }).flat();
}

const healthClient = new HealthClient({ baseURL: BASE_URL });
export function useTickerHealthStatus() {
  // TODO: introduce exponential backoff for health checks
  // add a polling call to health api that updates a state variable
  // this state could  be exposed to show health status in UI
  const [healthy, setHealthy] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const status = await healthClient.checkHealth();
        if (isMounted) {
          setHealthy(!!status);
        }
      } catch (error) {
        if (isMounted) {
          setHealthy(false);
        }
      }
    };
    checkHealth();
    const intervalId = setInterval(checkHealth, 1000); // Check every seconds
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);
  return healthy;
}
