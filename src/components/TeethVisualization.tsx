"use client";

import { SelectionMeasurement, TeethSelection } from "@/models/perio";
import { COMMON_TOOTH_MAPPING, TeethGrid } from "@/models/theeth";

// Component to visualize teeth data in anatomical layout
// FDI dental notation: First digit = quadrant (1-4), second digit = tooth position (1-8)
// Quadrant 1: Upper Right (11-18)
// Quadrant 2: Upper Left (21-28)
// Quadrant 3: Lower Left (31-38)
// Quadrant 4: Lower Right (41-48)
//
// Color coding:
// - Missing (X): gray with strikethrough
// - Selected (O): green
// - Skipped (-): pink
// - Default: white

const getToothColor = (status: string) => {
  let bgColor = "bg-white";
  let textColor = "text-black";

  if (status === 'X') {
    bgColor = "bg-gray-300";
    textColor = "text-gray-600 line-through";
  } else if (status === 'O') {
    bgColor = "bg-green-300";
  } else if (status === '-') {
    bgColor = "bg-pink-300";
  }

  return { bgColor, textColor };
};

const ToothCell = ({ tooth, status }: { tooth: string; status: string }) => {
  const { bgColor, textColor } = getToothColor(status);

  return (
    <div
      className={`flex items-center justify-center h-10 w-10 border rounded font-semibold text-sm ${bgColor} ${textColor}`}
    >
      {tooth}
    </div>
  );
};

const MAPPING = [
  COMMON_TOOTH_MAPPING[0].slice(0,8),
  COMMON_TOOTH_MAPPING[0].slice(8),
  COMMON_TOOTH_MAPPING[1].slice(0,8),
  COMMON_TOOTH_MAPPING[1].slice(8),
];

export default function TeethVisualization({ data }: { data: TeethSelection }) {
  const teethGrid = new TeethGrid(data, MAPPING);
  const serializedData = teethGrid.serialize((toothData, q, p) => {
    const labelNum = 11 + q * 10 + p; // FDI notation
    return { label: labelNum.toString(), status: toothData || '-' };
  });
  const renderQuadrant = (teeth: { label: string; status: SelectionMeasurement; }[]) => {
    return teeth.map((tooth) => (
      <ToothCell
        key={tooth.label}
        tooth={tooth.label}
        status={tooth.status}
      />
    ));
  };

  return (
    <div className="inline-block border-2 border-gray-400 rounded-lg p-4 bg-gray-700">
      {/* Upper teeth */}
      <div className="flex gap-1 mb-6">
        {/* Upper Left (21-28) - reversed */}
        <div className="flex gap-1">{renderQuadrant(serializedData[0])}</div>

        {/* Midline divider */}
        <div className="w-1 bg-gray-600 mx-2"></div>

        {/* Upper Right (11-18) */}
        <div className="flex gap-1">{renderQuadrant(serializedData[1])}</div>
      </div>

      {/* Midline separator */}
      <div className="h-1 bg-gray-600 mb-6"></div>

      {/* Lower teeth */}
      <div className="flex gap-1">
        {/* Lower Left (31-38) - reversed */}
        <div className="flex gap-1">{renderQuadrant(serializedData[2])}</div>

        {/* Midline divider */}
        <div className="w-1 bg-gray-600 mx-2"></div>

        {/* Lower Right (41-48) */}
        <div className="flex gap-1">{renderQuadrant(serializedData[3])}</div>
      </div>
    </div>
  );
}