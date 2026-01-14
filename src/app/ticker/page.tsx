"use client";

import { useState } from "react";
import TickerView from './components/TickerView'
import Obfuscation from "@/components/Obfuscate";

export default function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Ticker</h1>
        <p className="text-gray-600 dark:text-gray-300">
          See the combined stock ticker prices in real-time for your intraday trading needs
        </p>
      </div>
      <Obfuscation>
        <TickerView />
      </Obfuscation>
    </div>
  );
}
