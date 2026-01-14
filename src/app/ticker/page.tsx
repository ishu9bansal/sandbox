"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

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
      <SignedIn>
        <Card title="Main Content">
          <div className="text-center space-y-6">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
              {count}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                onClick={() => setCount(count - 1)}
              >
                Decrement
              </Button>
              <Button
                variant="outline"
                onClick={() => setCount(0)}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={() => setCount(count + 1)}
              >
                Increment
              </Button>
            </div>
          </div>
        </Card>
      </SignedIn>
      <SignedOut>
        {/* TODO: This is not safe, just obfuscation. Check how to configure route protection via middleware in clerk. */}
        <Card title="You need to Login">
          <div className="mb-4 text-gray-600 dark:text-gray-300">
            Please sign in to access this feature.
          </div>
          <div className="flex justify-center">
            <SignInButton>
              <Button variant="primary">Sign In</Button>
            </SignInButton>
          </div>
        </Card>
      </SignedOut>
    </div>
  );
}
