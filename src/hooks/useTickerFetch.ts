import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addLiveQuote, selectInstruments, setInstruments } from "@/store/slices/tickerSlice";
import { HealthClient, TickerClient, ZerodhaClient } from "@/services/ticker/tickerClient";
import { BASE_URL } from "@/services/ticker/constants";
import { HistoryRecord, Straddle, LiveQuoteResponse } from "@/models/ticker";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { ApiClientConfig } from "@/services/api/api";

export function useZerodhaApis() {
  const zerodhaClient = useZerodhaClient();
  const getLoginUrl = useCallback(async () => {
    try {
      const response = await zerodhaClient.getLoginUrl();
      if (!response || !response.login_url) {
        throw new Error("No login URL received");
      }
      return response.login_url;
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching Zerodha login URL");
      return null;
    }
  }, [zerodhaClient]);
  const logout = useCallback(async () => {
    try {
      await zerodhaClient.logout();
      toast.success("Logged out from Zerodha successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while logging out from Zerodha");
    }
  }, [zerodhaClient]);
  return { getLoginUrl, logout };
}

export function useZerodhaCallbackApi() {
  const zerodhaClient = useZerodhaClient();
  const login = useCallback(async (request_token: string) => {
    try {
      const resp = await zerodhaClient.login(request_token);
      if (!resp) {
        throw new Error("No response from login");
      }
      return;
    } catch (error) {
      console.error(error);
      throw new Error("Error while logging in to Zerodha");
    }
  }, [zerodhaClient]);
  return login;
}

export function useTickerUser() {
  const tickerClient = useTickerClient();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>({});
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await tickerClient.getUser();
      if (!userData) {
        throw new Error("No user data received");
      }
      setUser(userData);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
        setUser({error: error.message});
      }
    } finally {
      setLoading(false);
    }
  }, [tickerClient]);
  useEffect(() => {
    reload();
  }, [])
  return { reload, user, loading };
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

export function useStraddleHistory(autoReload: boolean, ids: string[], from: Date, to: Date) {
  const fetchHistory = useStraddleHistoryApi();
  const [histories, setHistories] = useState<Record<string, HistoryRecord[]>>({});
  const reloadSingleHistory = useCallback(async (id: string) => {
    try {
      const historyData = await fetchHistory(id, from, to);
      setHistories(prev => ({ ...prev, [id]: historyData }));
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching a straddle history");
    }
  }, [from, to, fetchHistory]);
  const reloadHistories = useCallback(async () => {
    try {
      await Promise.all(ids.map(id => reloadSingleHistory(id)));
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching straddle histories");
    }
  }, [ids, reloadSingleHistory]);
  useEffect(() => {
    if (!autoReload) return;
    reloadHistories();
  }, [ids, from, to, autoReload])
  return { reloadHistories, histories };
}

export function useStraddleHistoryApi() {
  const tickerClient = useTickerClient();
  const fetchHistory = useCallback(async (id: string, from: Date, to: Date) => {
    try {
      const historyResponse = await tickerClient.getStraddleHistory(id, from, to);
      const history = historyResponse ? historyResponse[id] : null;
      if (!history) {
        throw new Error("Failed to fetch straddle history");
      }
      return history;
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching straddle history");
      return [];
    }
  }, [tickerClient]);
  return fetchHistory;
}

export function useHistory(autoReload: boolean, underlying: string, from: Date, to: Date) {
  const fetchHistory = useHistoryApi();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const reload = useCallback(async () => {
    try {
      const historyData = await fetchHistory(underlying, from, to);
      setHistory(historyData);
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching history");
    }
  }, [underlying, from, to, fetchHistory]);
  useEffect(() => {
    if (!autoReload) return;
    reload();
  }, [underlying, from, to, autoReload])
  return { reload, history };
}

export function useHistoryApi() {
  const tickerClient = useTickerClient();
  const fetchHistory = useCallback(async (underlying: string, from: Date, to: Date) => {
    try {
      const historyResponse = await tickerClient.getHistory(underlying, from, to);
      const history = historyResponse ? historyResponse[underlying] : null;
      if (!history) {
        throw new Error("Failed to fetch histiry");
      }
      return history;
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching history");
      return [];
    }
  }, [tickerClient]);
  return fetchHistory;
}

export function useLive(underlying: string, straddleIds: string[]) {
  const dispatch = useAppDispatch();
  const { fetchQuote, fetchStraddleQuote } = useLiveApis();
  const persistResponse = useCallback(async (cancel: boolean, fetcher: () => Promise<LiveQuoteResponse>) => {
    try {
      const quoteResponse = await fetcher();
      if (cancel) return;
      dispatch(addLiveQuote(quoteResponse));
    } catch (error) {
      console.error(error); // already handled in fetcher, no need to toast again
    }
  }, []);
  const fetchLiveData = useCallback(async (cancel: boolean) => {
    await Promise.all([
      persistResponse(cancel, () => fetchQuote(underlying)),
      persistResponse(cancel, () => fetchStraddleQuote(straddleIds)),
    ]);
  }, [underlying, straddleIds, fetchQuote, fetchStraddleQuote, persistResponse]);
  return fetchLiveData;
}

export function useLiveApis() {
  const tickerClient = useTickerClient();
  const fetchQuote = useCallback(async (underlying: string) => {
    try {
      const quoteResponse = await tickerClient.getQuote(underlying);
      if (!quoteResponse) {
        throw new Error("Failed to fetch live quote");
      }
      return quoteResponse;
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching live quote");
      return {};
    }
  }, [tickerClient]);
  const fetchStraddleQuote = useCallback(async (ids: string[]) => {
    try {
      const quoteResponse = await tickerClient.getStraddleQuotes(ids);
      if (!quoteResponse) {
        throw new Error("Failed to fetch live straddle quote");
      }
      return quoteResponse;
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching live straddle quote");
      return {};
    }
  }, [tickerClient]);
  return { fetchQuote, fetchStraddleQuote };
}

export function useInterval(call: (cancel: boolean) => Promise<void>, interval: number = 1000) {
  useEffect(() => {
    if (!interval) return;
    let cancel = false;
    const intervalMethod = async () => {
      await call(cancel);
    };
    intervalMethod(); // Initial
    const intervalId = setInterval(intervalMethod, interval);
    return () => {
      cancel = true;
      clearInterval(intervalId);
    };
  }, [interval, call]);
  return;
}

const HEALTHY_DEFAULT_INTERVAL = 30000; // 30 seconds
const UNHEALTHY_INITIAL_INTERVAL = 500; // 500 ms
const healthClient = new HealthClient({ baseURL: BASE_URL });
export function useTickerHealthStatus() {
  const [healthy, setHealthy] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | undefined;
    let currentDelay = HEALTHY_DEFAULT_INTERVAL;
    
    const checkHealth = async () => {
      try {
        const status = await healthClient.checkHealth();
        if (isMounted) {
          setHealthy(!!status);
          // Reset to normal interval when healthy
          currentDelay = HEALTHY_DEFAULT_INTERVAL;
        }
      } catch (error) {
        if (isMounted) {
          setHealthy(false);
          // Exponential backoff: start at 500ms or double current delay
          if (currentDelay >= HEALTHY_DEFAULT_INTERVAL) {
            // We were in healthy mode, start backoff at 500ms
            currentDelay = UNHEALTHY_INITIAL_INTERVAL;
          } else {
            // Continue backoff, double the delay (capped at HEALTHY_DEFAULT_INTERVAL)
            currentDelay = Math.min(currentDelay * 2, HEALTHY_DEFAULT_INTERVAL);
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
  const builder = useCallback((config: ApiClientConfig) => new TickerClient(config), []);
  return useAuthenticatedClient(builder);
}

function useZerodhaClient() {
  const builder = useCallback((config: ApiClientConfig) => new ZerodhaClient(config), []);
  return useAuthenticatedClient(builder);
}

function useAuthenticatedClient<T>(clientBuilder: (config: ApiClientConfig) => T) {
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
  const client = useMemo(() => clientBuilder({
    baseURL: BASE_URL,
    authBuilder,
  }), [authBuilder, clientBuilder]);
  return client;
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
