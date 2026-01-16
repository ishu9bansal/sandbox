import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addSnapshots, selectInstruments, selectTickerData, setInstruments } from "@/store/slices/tickerSlice";
import { HealthClient, TickerClient } from "@/services/ticker/tickerClient";
import { BASE_URL } from "@/services/ticker/constants";
import { Instrument, InstrumentResponse, PriceSnapshot, Quote } from "@/models/ticker";
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
  }, []);
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
  }, []);
  useEffect(() => {
    reload();
  }, [])
  return { reload, instruments };
}

export function useLiveData(interval: number = 1000) {
  const tickerClient = useTickerClient();
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
        toast.error("Error while fetching live data");
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
  const tickerClient = new TickerClient({
    baseURL: BASE_URL,
    authBuilder,
  });
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
