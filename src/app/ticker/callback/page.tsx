"use client";

import { useZerodhaCallbackApi } from "@/hooks/useTickerFetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function CallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const queryParams = useSearchParams();
  const token = queryParams.get("request_token");
  const router = useRouter();
  const login = useZerodhaCallbackApi();
  const onLogin = useCallback(async (token: string) => {
    try {
      await login(token);
      setError(null);
      router.replace('/ticker');
    } catch (error) {
      console.error(error);
      setError("Login failed");
    }
  }, [login, router]);
  useEffect(() => {
    if (token) {
      onLogin(token);
    }
  }, [token]);
  // TODO: add a back to home button
  return (
    <div>
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div>Logging in...</div>
      )}
    </div>
  );
}
