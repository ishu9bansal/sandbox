import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addSnapshots, selectInstruments, selectLiveTrackingIds, selectTickerData, setInstruments, setStraddlePrices } from "@/store/slices/tickerSlice";
import { HealthClient, TickerClient } from "@/services/ticker/tickerClient";
import { BASE_URL } from "@/services/ticker/constants";
import { PriceSnapshot, Quote, Straddle } from "@/models/ticker";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export function useTickerUser() {
  const tickerClient = useTickerClient();
  const [user, setUser] = useState<any>({});
  const reload = useCallback(async () => {
    try {
      const userData = await tickerClient.getUser();
      if (!userData) {
        throw new Error("No user data received");
      }
      setUser(userData);
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching user data");
    }
  }, [tickerClient]);
  useEffect(() => {
    reload();
  }, [])
  return { reload, user };
}

export function useInstruments() {
  const tickerClient = useTickerClient();
  const instruments = useAppSelector(selectInstruments);
  const dispatch = useAppDispatch();
  const reload = useCallback(async () => {
    try {
      const instruments = await tickerClient.getInstruments();
      if (!instruments) {
        throw new Error("No instruments received");
      }
      dispatch(setInstruments(instruments));
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching instruments");
    }
  }, [tickerClient]);
  useEffect(() => {
    reload();
  }, [])
  return { reload, instruments };
}

export function useStraddles(underlying: string) {
  const tickerClient = useTickerClient();
  const [straddles, setStraddles] = useState<Straddle[]>([]);
  const reload = useCallback(async () => {
    try {
      const straddleData = await tickerClient.getStraddles(underlying);
      if (!straddleData) {
        throw new Error("No straddle data received");
      }
      setStraddles(straddleData);
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching straddles");
    }
  }, [underlying, tickerClient]);
  useEffect(() => {
    reload();
  }, [underlying])
  return { reload, straddles };
}

export function useStraddlePriceApi(ids: string[]) {
  const tickerClient = useTickerClient();
  const dispatch = useAppDispatch();
  const fetchLatestPrice = useCallback(async (cancel: boolean) => {
    if (ids.length === 0) {
      console.debug("No straddle IDs selected to fetch prices for");
      return;
    }
    try {
      const prices = await tickerClient.getStraddleQuotes(ids);
      if (!prices) {
        throw new Error("Failed to fetch straddle prices");
      }
      if (cancel) return;
      dispatch(setStraddlePrices(prices));
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching straddle prices");
    }
  }, [ids, tickerClient]);
  return fetchLatestPrice;
}

export function useLiveData(interval: number = 1000) {
  const tickerClient = useTickerClient();
  const data = useAppSelector(selectTickerData);
  const dispatch = useAppDispatch();
  const fetchQuote = useCallback(async (cancel: boolean) => {
    try {
      const underlying = 'NIFTY';
      const { timestamp, quote } = await tickerClient.getQuote(underlying);
      if (!quote) {
        throw new Error("No quote received");
      }
      const snapshot = snapshotFromQuote(timestamp, quote, underlying);
      if (cancel) return;
      dispatch(addSnapshots([snapshot]));
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching live data");
    }
  }, [tickerClient]);
  const straddleIds = useAppSelector(selectLiveTrackingIds);
  const fetchStraddlePrices = useStraddlePriceApi(straddleIds);
  useEffect(() => {
    if (!interval) return;
    let isMounted = true;
    const intervalMethod = async () => {
      await Promise.all([
        fetchQuote(!isMounted),
        fetchStraddlePrices(!isMounted),
      ]);
    };
    intervalMethod(); // Initial
    const intervalId = setInterval(intervalMethod, interval);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [interval, fetchQuote, fetchStraddlePrices]);
  return { data };
}

function snapshotFromQuote(timestamp: number, quote: Quote | null, underlying: string): PriceSnapshot {
  const price = quote?.last_price;
  if (price === undefined || price === null) {
    throw new Error("Invalid quote data");
  }
  return { underlying, timestamp, price };
}

const healthClient = new HealthClient({ baseURL: BASE_URL });
export function useTickerHealthStatus() {
  const [healthy, setHealthy] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | undefined;
    let currentDelay = 60000; // Start with 60s for healthy state
    
    const checkHealth = async () => {
      try {
        const status = await healthClient.checkHealth();
        if (isMounted) {
          setHealthy(!!status);
          // Reset to normal interval when healthy
          currentDelay = 60000;
        }
      } catch (error) {
        if (isMounted) {
          setHealthy(false);
          // Exponential backoff: start at 500ms or double current delay
          if (currentDelay >= 60000) {
            // We were in healthy mode, start backoff at 500ms
            currentDelay = 500;
          } else {
            // Continue backoff, double the delay (capped at 60s)
            currentDelay = Math.min(currentDelay * 2, 60000);
          }
        }
      }
      
      if (isMounted) {
        timeoutId = setTimeout(checkHealth, currentDelay);
      }
    };
    
    checkHealth(); // Initial check
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);
  
  return healthy;
}

function useTickerClient() {
  const { getToken } = useAuth();
  const authBuilder = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [getToken]);
  const tickerClient = useMemo(() => new TickerClient({
    baseURL: BASE_URL,
    authBuilder,
  }), [authBuilder]);
  return tickerClient;
}

export function useLongLivedToken() {
  const { getToken } = useAuth();
  const copyLLT = useCallback(async () => {
    const newToken = await getToken({ template: "long-lived-token" });
    await navigator.clipboard.writeText(newToken || "");
    toast.success("Long lived token copied to clipboard");
  }, [getToken]);
  return copyLLT;
}
