"use client";

import Obfuscation from "@/components/Obfuscate";
import InstrumentView from "./components/InstrumentsView";
import TickerView from "./components/TickerView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TickerHealth from "./components/TickerHealth";

export default function CounterPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Ticker</h1>
        <p className="text-gray-600 dark:text-gray-300">
          See the combined stock ticker prices in real-time for your intraday trading needs
        </p>
      </div>
      <Obfuscation>
        <Tabs defaultValue="instruments" className="mb-4">
          <TabsList>
            <TabsTrigger value="instruments">Instruments</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
          </TabsList>
          <TickerHealth />
          <TabsContent value="live">
            <TickerView />
          </TabsContent>
          <TabsContent value="instruments">
            <InstrumentView />
          </TabsContent>
        </Tabs>
      </Obfuscation>
    </div>
  );
}
