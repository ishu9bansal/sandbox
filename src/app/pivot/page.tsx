"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function PivotPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Counter Demo</h1>
        <p className="text-gray-600 dark:text-gray-300">
          An interactive counter demonstrating state management and component interactivity.
        </p>
      </div>

      <Card title="Counter">
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

      <Card title="Code Example">
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
{`"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
          </code>
        </pre>
      </Card>

      <Card title="Features">
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>Client-side state management with React hooks</li>
          <li>Reusable Button component with variants</li>
          <li>Responsive design with Tailwind CSS</li>
          <li>Dark mode support</li>
        </ul>
      </Card>
    </div>
  );
}
