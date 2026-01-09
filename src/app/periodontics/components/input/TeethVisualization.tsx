"use client";

import { TeethInputRecord, TeethSerializer, TVal } from "@/models/teethInput";
import { generateVisualMapping } from "@/utils/theeth";

const MAPPING = generateVisualMapping();
const serializer = new TeethSerializer<TVal>(MAPPING);

export default function TeethVisualization({ data }: { data: TeethInputRecord<TVal>; }) {
  const values = serializer.serialize(data, '-');
  return (
    <div className="overflow-x-auto">
      <div className="inline-block border-2 border-gray-400 rounded-lg p-4 bg-gray-700">
        {/* Upper teeth */}
        <div className="flex gap-1 mb-6">
          {/* Upper Left */}
          <div className="flex gap-1">
            <Quadrant labels={MAPPING[0]} values={values[0]} />
          </div>

          {/* Midline divider */}
          <div className="w-1 bg-gray-600 mx-2"></div>

          {/* Upper Right */}
          <div className="flex gap-1">
            <Quadrant labels={MAPPING[1]} values={values[1]} />
          </div>
        </div>

        {/* Midline separator */}
        <div className="h-1 bg-gray-600 mb-6"></div>

        {/* Lower teeth */}
        <div className="flex gap-1">
          {/* Lower Left */}
          <div className="flex gap-1">
            <Quadrant labels={MAPPING[2]} values={values[2]} />
          </div>

          {/* Midline divider */}
          <div className="w-1 bg-gray-600 mx-2"></div>

          {/* Lower Right */}
          <div className="flex gap-1">
            <Quadrant labels={MAPPING[3]} values={values[3]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Quadrant({ labels, values }: { labels: string[]; values: TVal[]; }) {
  return <>{values.map((val, i) => <ToothCell key={i} tooth={labels[i]} status={val} />)}</>;
}

// Component to visualize teeth data in anatomical layout
// Color coding:
// - Missing (X): gray with strikethrough
// - Selected (O): green
// - Skipped (-): pink
const COLOR_MAP: Record<TVal, { bg: string; text: string; }> = {
  'X': { bg: "bg-gray-300", text: "text-gray-600 line-through" },
  'O': { bg: "bg-green-300", text: "text-black" },
  '-': { bg: "bg-pink-300", text: "text-black" },
}

const ToothCell = ({ tooth, status }: { tooth: string; status: TVal }) => {
  const { bg, text } = COLOR_MAP[status];
  const baseClass = "flex items-center justify-center h-10 w-10 border rounded font-semibold text-sm";
  const className = `${baseClass} ${bg} ${text}`;
  return (<div className={className} >{tooth}</div>);
};
