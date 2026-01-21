import { PriceDataPoint } from "@/models/ticker";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ChartProps = {
  chartData: PriceDataPoint[];
  primaryKeys: string[];
  secondaryKeys: string[];
  xAxisDomain: [number, number];
};

export default function Chart({ chartData, xAxisDomain, secondaryKeys, primaryKeys }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        
        {/* X-axis: Time */}
        <XAxis
          type='number'
          stroke="rgba(255, 255, 255, 0.6)"
          tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
          dataKey="timestamp"
          allowDataOverflow={true}
          tickFormatter={displayHorizontalTick}
          domain={xAxisDomain}
        />
        
        {/* Right Y-axis: Spot Price */}
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="rgba(255, 255, 255, 0.4)"
          tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 12 }}
          label={{
            value: 'Spot Price (₹)',
            angle: 90,
            position: 'insideRight',
            style: { fill: 'rgba(255, 255, 255, 0.4)' },
          }}
          tickFormatter={(val) => `${Math.round(val)}`}
          domain={['dataMin', 'dataMax']}
        />
        
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: '#fff' }}
          iconType="line"
        />
        
        {/* Left Y-axis: Premium (₹) */}
        <YAxis
          yAxisId="left"
          stroke="rgba(255, 255, 255, 0.6)"
          tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
          label={{
            value: 'Combined Premium (₹)',
            angle: -90,
            position: 'insideLeft',
            style: { fill: 'rgba(255, 255, 255, 0.6)' },
          }}
          tickFormatter={(val) => `${Math.round(val)}`}
          domain={['dataMin', 'dataMax']}
        />
        {secondaryKeys.map((key, i) => (
          <Line
            key={key}
            yAxisId="left"
            type="monotone"
            dataKey={key}
            stroke={COLOR_PALETTE[i % COLOR_PALETTE.length]}
            strokeWidth={1.5}
            dot={false}
            name={key}
          />
        ))}
        {/* Spot Price Line - Lighter, on right axis */}
        {primaryKeys.map((key, i) => (
          <Line
            key={key}
            yAxisId="right"
            type="monotone"
            dataKey={key}
            stroke="#FF5733"
            strokeWidth={3}
            dot={false}
            name={`Spot Price (${key})`}
            strokeDasharray="5 5"
          />
        ))}
        
      </LineChart>
    </ResponsiveContainer>
  );
}

const COLOR_PALETTE = [
  '#33FF57', // Green
  '#3357FF', // Blue
  '#F333FF', // Magenta
  '#33FFF5', // Cyan
  '#F5FF33', // Yellow
  '#FF33A8', // Pink
  '#A833FF', // Purple
];

// Custom tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{name: string; value: number; color: string; payload?: {timestamp: number}}>}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-4 bg-black/50 border border-white/20 rounded"
      >
        <p className="text-white text-sm mb-2">
          Time: {payload[0]?.payload?.timestamp ? displayDateTime(payload[0].payload.timestamp) : ''}
        </p>
        {payload.map((entry, index: number) => (
          <p
            key={index}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {entry.name}: {'₹'}
            {entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function displayTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}
function displayDate(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}
function displayDateTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
function displayHorizontalTick(timestamp: number) {
  // Display as HH:MM AM/PM
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
