import { PriceDataPoint } from "@/models/ticker";

export type ChartProps = {
  chartData: PriceDataPoint[];
  primaryKeys: string[];
  secondaryKeys: string[];
  xAxisDomain: [number, number];
};

export default function Chart({}: ChartProps) {
  return <div>Chart Component</div>;
}
