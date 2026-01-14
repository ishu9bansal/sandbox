import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addSnapshots, selectInstruments, selectTickerData, setInstruments } from "@/store/slices/tickerSlice";
import { StraddleDataSimulator } from "@/services/ticker/apiServiceSimulator";
import { HealthClient, TickerClient } from "@/services/ticker/tickerClient";
import ApiClient from "@/services/api/api";
import { BASE_URL } from "@/services/ticker/constants";
import { Instrument, InstrumentResponse, PremiumSnapshot } from "@/models/ticker";
import { PriceGenerator } from "@/services/ticker/dataGenerator";

// const today = new Date();
// const defaultStartTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30, 0, 0);
// const defaultSimulator = new StraddleDataSimulator(defaultStartTime);

// export function useTickerFetch() {
//   const dispatch = useAppDispatch();
//   const data = useAppSelector(selectTickerData);
//   const lastTimestamp = data.length > 0 ? data[data.length - 1].timestamp : null;
//   const fetcher = useCallback(async () => {
//     const newData = await defaultSimulator.fetchDeltaData(lastTimestamp);
//     dispatch(addSnapshots(newData));
//   }, [lastTimestamp]);
//   useEffect(() => {
//     fetcher();
//   }, [])
//   return fetcher;
// }

const tickerClient = new TickerClient(new ApiClient({
  baseURL: BASE_URL,
}));

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
        const quote = await tickerClient.getQuote('NIFTY');
        if (!quote) {
          throw new Error("No quote received");
        }
        const snapshot = snapshotFromQuote(quote);
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

const priceGenerator = new PriceGenerator();
function snapshotFromQuote(quote: any): PremiumSnapshot {
  const timestamp = (new Date()).getTime();
  const spotPrice = priceGenerator.generateNextPrice();
  const snapshot = {
    timestamp,
    spotPrice,
    premiums: {
      '-3': 0,
      '-2': 0,
      '-1': 0,
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
    },
  };
  return snapshot;
}

function listFromMap(instrumentMap: InstrumentResponse): Instrument[] {
  return Object.values(instrumentMap).map((instGroup) => {
    return Object.values(instGroup).map((instGroup2) => {
      return Object.values(instGroup2).flat();
    }).flat();
  }).flat();
}

const healthClient = new HealthClient(new ApiClient({
  baseURL: BASE_URL,
}));
export function useTickerHealthStatus() {
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
