"use client";

import { SelectionMeasurement, TeethSelection } from "@/models/perio";
import { SetStateAction } from "react";

// Component to visualize teeth data in anatomical layout
// Color coding:
// - Missing (X): gray with strikethrough
// - Selected (O): green
// - Skipped (-): pink
// - Default: white

const getToothColor = (status: string, clickable: boolean) => {
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

  const hoverEffect = clickable ? "hover:brightness-90 cursor-pointer" : "";

  return { bgColor, textColor, hoverEffect };
};

const ToothCell = ({ tooth, status, onToggle }: { tooth: string; status: string; onToggle?: () => void }) => {
  const { bgColor, textColor, hoverEffect } = getToothColor(status, !!onToggle);

  return (
    <div
      className={`flex items-center justify-center h-10 w-10 border rounded font-semibold text-sm ${bgColor} ${textColor} ${hoverEffect}`}
      onClick={onToggle}
    >
      {tooth}
    </div>
  );
};

/**
 * Mapping for TeethGrid to represent FDI notation in anatomical layout
 * Each entry is an object with quadrant (q) and position (p)
 * 18 17 16 15 14 13 12 11
 * 21 22 23 24 25 26 27 28
 * 48 47 46 45 44 43 42 41
 * 31 32 33 34 35 36 37 38
 */
const MAPPING = [
  Array.from({ length: 8 }, (_, i) => ({ q: 0, p: (7-i) })),
  Array.from({ length: 8 }, (_, i) => ({ q: 1, p: i })),
  Array.from({ length: 8 }, (_, i) => ({ q: 3, p: (7-i) })),
  Array.from({ length: 8 }, (_, i) => ({ q: 2, p: i })),
];

export default function TeethVisualization({ data, onChange }: { data: TeethSelection; onChange?: (data: SetStateAction<TeethSelection>) => void; }) {
  const serializedData = MAPPING.map((ids) => ids.map(
    ({ q, p }) => ({
      label: (11 + q * 10 + p).toString(),
      status: data[q][p] || '-',
      onToggleStatus: onChange ? () => onChange(prev => {
        const updated = [...prev] as TeethSelection;
        updated[q][p] = (updated[q][p] === 'X') ? 'O' : 'X';
        return updated;
      }) : undefined,
    })
  ));
  const renderQuadrant = (teeth: { label: string; status: SelectionMeasurement; onToggleStatus?: () => void; }[]) => {
    return teeth.map((tooth) => (
      <ToothCell
        key={tooth.label}
        tooth={tooth.label}
        status={tooth.status}
        onToggle={tooth.onToggleStatus}
      />
    ));
  };

  return (
    <div className="overflow-x-auto">
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
    </div>
  );
}