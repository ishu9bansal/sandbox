"use client";

import { useCallback, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { copyToClipboard } from "@/utils/helpers";

export default function PivotPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleProcess = useCallback(() => {
    setOutput(input);
  }, [input]);
  const handleReset = useCallback(() => {
    setInput("");
  }, []);
  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Pivot Headers</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Reduce your pivot table header clutter with this dynamic header management tool
        </p>
      </div>

      <Card title="Input">
        <div className="text-center space-y-6">
          <textarea
            style={{
              fontFamily: 'monospace',
              whiteSpace: 'pre',
              overflow: 'auto',
              fontSize: '16px',
            }}
            className="w-full h-40 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Paste your pivot table data here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={handleProcess}
            >
              Process
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Output">
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
          {output || "Processed output will appear here."}
        </pre>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="primary"
            onClick={handleCopy}
          >
            Copy
          </Button>
        </div>
      </Card>

      <Card title="Features">
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>Very Useful tool</li>
          <li>Saves so much time</li>
          <li>Very much awesome</li>
          <li>Wow!</li>
        </ul>
      </Card>
    </div>
  );
}
