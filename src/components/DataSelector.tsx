import { JSX } from "react";

interface DataSelectorProps<T> {
  data: T[];
  selected: T | null;
  onSelect: (datum: T | null) => void;
  renderer: (datum: T) => JSX.Element | string;
}
export default function DataSelector<T>({ data, selected, onSelect, renderer }: DataSelectorProps<T>) {
  // TODO: Implement search/filtering
  return (
    <div>
      <select
        value={selected ? data.indexOf(selected) : -1}
        onChange={(e) => {
          const index = parseInt(e.target.value, 10);
          if (index >= 0 && index < data.length) {
            onSelect(data[index]);
          } else {
            onSelect(null);
          }
        }}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      >
        <option value={-1}>-- Select Patient --</option>
        {data.map((datum, index) => (
          <option key={index} value={index}>
            {renderer(datum)}
          </option>
        ))}
      </select>
    </div>
  );
}
