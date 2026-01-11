"use client";

import { useCallback, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { copyToClipboard } from "@/utils/helpers";
import { PLACEHOLDER_INPUT, PLACEHOLDER_OUTPUT } from "./constants";
import { toast } from "sonner";
import DataSelector from "@/components/compositions/data-selector";

type Pipeline = {
  id: string;
  label: string;
};
const pipelines: Pipeline[] = [
  { id: "pipeline1", label: "Pipeline 1" },
  { id: "pipeline2", label: "Pipeline 2" },
  { id: "pipeline3", label: "Pipeline 3" },
];

export default function PivotPage() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const process = useCallback((data: string) => data, []);

  const handleProcess = useCallback(() => {
    setOutput(process(input));
  }, [input]);
  const handleReset = useCallback(() => {
    setInput("");
  }, []);
  const handleCopy = useCallback(() => {
    copyToClipboard(output);
    toast.success("Copied to clipboard!")
  }, [output]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">JS Pipeline</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Run a pipeline of transformations on your data using JavaScript functions
        </p>
      </div>

      <Card title="Select Pipeline">
        <DataSelector
          data={pipelines}
          typeLabel="pipeline"
          isSelected={(p) => pipeline ? p.id === pipeline.id : false}
          onSelect={setPipeline}
          toString={p => p.label}
          uniqueKey={(p) => p.id}
        />
      </Card>

      <Card title="Process">
        <div className="text-center space-y-6">
          <textarea
            style={{
              fontFamily: 'monospace',
              whiteSpace: 'pre',
              overflow: 'auto',
              fontSize: '16px',
            }}
            className="w-full h-40 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder={PLACEHOLDER_INPUT}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset Input
            </Button>
            <Button
              variant="primary"
              onClick={handleProcess}
              disabled={!pipeline}
              style={{
                cursor: (pipeline ? 'default' : 'not-allowed'),
              }}
            >
              Process
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-4 m-4">
          <Button
            variant="primary"
            onClick={handleCopy}
          >
            Copy Output
          </Button>
        </div>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto" style={{ color: output ? 'inherit' : 'gray' }}>
          {output || PLACEHOLDER_OUTPUT}
        </pre>
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
