"use client";

import Obfuscation from "@/components/Obfuscate";
import InstrumentView from "./components/InstrumentsView";
import TickerView from "./components/TickerView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TickerHealth from "./components/TickerHealth";
import UserView from "./components/UserView";
import { Button } from "@/components/ui/button";
import { useLongLivedToken } from "@/hooks/useTickerFetch";
import StraddleView from "./components/StraddleView";
import HistoryView from "./components/HistoryView";

export default function CounterPage() {
  const copyLLT = useLongLivedToken();
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Ticker</h1>
        <p className="text-gray-600 dark:text-gray-300">
          See the combined stock ticker prices in real-time for your intraday trading needs
        </p>
      </div>
      <Obfuscation>
        <Tabs defaultValue="user" className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="instruments">Instruments</TabsTrigger>
              <TabsTrigger value="straddles">Straddles</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <TickerHealth />
              <Button variant="ghost" size="sm" onClick={copyLLT}>
                Copy LLT
              </Button>
            </div>
          </div>
          <TabsContent value="history">
            <HistoryView />
          </TabsContent>
          <TabsContent value="live">
            <TickerView />
          </TabsContent>
          <TabsContent value="instruments">
            <InstrumentView />
          </TabsContent>
          <TabsContent value="straddles">
            <StraddleView />
          </TabsContent>
          <TabsContent value="user">
            <UserView />
          </TabsContent>
        </Tabs>
      </Obfuscation>
    </div>
  );
}
