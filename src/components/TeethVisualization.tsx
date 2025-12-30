"use client";

import { Teeth } from "@/store/perioSlice";

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

export default function TeethVisualization({ data }: { data: Teeth }) {
  // Extract teeth by quadrant
  const quadrant1 = [11, 12, 13, 14, 15, 16, 17, 18]; // Upper Right
  const quadrant2 = [28, 27, 26, 25, 24, 23, 22, 21]; // Upper Left (reversed for visual)
  const quadrant3 = [38, 37, 36, 35, 34, 33, 32, 31]; // Lower Left (reversed for visual)
  const quadrant4 = [41, 42, 43, 44, 45, 46, 47, 48]; // Lower Right

  const renderQuadrant = (teeth: number[]) => {
    return teeth.map((tooth) => (
      <ToothCell
        key={tooth}
        tooth={tooth.toString()}
        status={data[tooth] || "-"}
      />
    ));
  };

  return (
    <div className="inline-block border-2 border-gray-400 rounded-lg p-4 bg-gray-700">
      {/* Upper teeth */}
      <div className="flex gap-1 mb-6">
        {/* Upper Left (21-28) - reversed */}
        <div className="flex gap-1">{renderQuadrant(quadrant2)}</div>

        {/* Midline divider */}
        <div className="w-1 bg-gray-600 mx-2"></div>

        {/* Upper Right (11-18) */}
        <div className="flex gap-1">{renderQuadrant(quadrant1)}</div>
      </div>

      {/* Midline separator */}
      <div className="h-1 bg-gray-600 mb-6"></div>

      {/* Lower teeth */}
      <div className="flex gap-1">
        {/* Lower Left (31-38) - reversed */}
        <div className="flex gap-1">{renderQuadrant(quadrant3)}</div>

        {/* Midline divider */}
        <div className="w-1 bg-gray-600 mx-2"></div>

        {/* Lower Right (41-48) */}
        <div className="flex gap-1">{renderQuadrant(quadrant4)}</div>
      </div>
    </div>
  );
}