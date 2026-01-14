import React, { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppSelector } from '@/store/hooks';
import { selectTickerData } from '@/store/slices/tickerSlice';
import type { PremiumSnapshot } from '@/models/ticker';
import { useTickerFetch } from '@/hooks/useTickerFetch';

const XAXIS_TICK_INTERVAL = 15 * 60; // 15 minutes in seconds
const TOTAL_SIMULATION_DURATION = 6 * 60 * 60 / 6; // 6 hours in seconds
const MARKET_OPEN_TIME = 9.5 * 60 * 60; // 9:30 AM in seconds
const tickValueGenerator = (index: number) => {
    //  HH:MM:SS format
    const secondsFromMarketOpen = 5*index;
    const totalSeconds = MARKET_OPEN_TIME + secondsFromMarketOpen;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString()
        .padStart(2, '0')}:${minutes.toString()
        .padStart(2, '0')}:${seconds.toString()
        .padStart(2, '0')}`;
}
const EMPTY_DATA = Array.from({ length: 1 + TOTAL_SIMULATION_DURATION / 5 }, (_, i) => ({ time: tickValueGenerator(i) }));

const StraddleVisualization: React.FC = () => {
  const data = useAppSelector(selectTickerData);
  const fetcher = useTickerFetch();

  useEffect(() => {
    const interval = setInterval(fetcher, 5000);
    return () => clearInterval(interval);
  }, [fetcher]);

  // Transform data for Recharts
  const chartData = [
    ...data.map((snapshot: PremiumSnapshot) => ({
      time: snapshot.timestamp,
      spotPrice: snapshot.spotPrice,
      'Strike -3': snapshot.premiums['-3'],
      'Strike -2': snapshot.premiums['-2'],
      'Strike -1': snapshot.premiums['-1'],
      'Strike 0 (ATM)': snapshot.premiums['0'],
      'Strike +1': snapshot.premiums['1'],
      'Strike +2': snapshot.premiums['2'],
      'Strike +3': snapshot.premiums['3'],
    })),
    ...EMPTY_DATA.slice(data.length),
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{name: string; value: number; color: string; payload?: {time: string}}>}) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-4 bg-black/90 border border-white/20 rounded"
        >
          <p className="text-black text-sm mb-2">
            Time: {payload[0]?.payload?.time}
          </p>
          {payload.map((entry, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.name === 'Spot Price' ? '₹' : '₹'}
              {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl text-black mb-2">
            Intraday Straddle Premium Visualization
          </h1>
          <p className="text-black/70">
            Monitor combined option premiums (Call + Put) across nearby strikes with spot price context
          </p>
        </div>

        {/* Controls */}
        {/* <Box sx={{ marginBottom: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={startSimulation}
            disabled={isSimulating}
          >
            {data.length === 0 ? 'Start Simulation' : 'Resume Simulation'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={stopSimulation}
            disabled={!isSimulating}
          >
            Pause Simulation
          </Button>
          <Button variant="outlined" color="error" onClick={resetData}>
            Reset Data
          </Button>
        </Box> */}

        {/* Chart */}
        <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded">
          {data.length === 0 ? (
            <div className="h-[600px] flex items-center justify-center">
              <p className="text-xl text-black/50">
                Click "Start Simulation" to begin monitoring
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={600}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                
                {/* X-axis: Time */}
                <XAxis
                  stroke="rgba(255, 255, 255, 0.6)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Show only HH:MM for cleaner display
                    const secondsFromMarketOpen = 5*value;
                    const totalSeconds = MARKET_OPEN_TIME + secondsFromMarketOpen;
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    return `${hours.toString().padStart(2, '0')}:${minutes
                      .toString()
                      .padStart(2, '0')}`;
                  }}
                  interval={XAXIS_TICK_INTERVAL/5} // ticks are every 5 seconds
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
                  domain={['dataMin', 'dataMax']}
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
                  domain={['dataMin', 'dataMax']}
                />
                
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ color: '#fff' }}
                  iconType="line"
                />
                
                {/* Premium Lines - Same color family, varying opacity */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Strike -3"
                  stroke="rgba(99, 179, 237, 0.4)"
                  strokeWidth={1.5}
                  dot={false}
                  name="Strike -3"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Strike -2"
                  stroke="rgba(99, 179, 237, 0.5)"
                  strokeWidth={1.5}
                  dot={false}
                  name="Strike -2"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Strike -1"
                  stroke="rgba(99, 179, 237, 0.7)"
                  strokeWidth={2}
                  dot={false}
                  name="Strike -1"
                />
                
                {/* ATM Line - Emphasized */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Strike 0 (ATM)"
                  stroke="rgba(99, 179, 237, 1)"
                  strokeWidth={3}
                  dot={false}
                  name="Strike 0 (ATM)"
                />
                
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Strike +1"
                  stroke="rgba(99, 179, 237, 0.7)"
                  strokeWidth={2}
                  dot={false}
                  name="Strike +1"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Strike +2"
                  stroke="rgba(99, 179, 237, 0.5)"
                  strokeWidth={1.5}
                  dot={false}
                  name="Strike +2"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Strike +3"
                  stroke="rgba(99, 179, 237, 0.4)"
                  strokeWidth={1.5}
                  dot={false}
                  name="Strike +3"
                />
                
                {/* Spot Price Line - Lighter, on right axis */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="spotPrice"
                  stroke="rgba(255, 0, 0, 0.5)"
                  strokeWidth={1.5}
                  dot={false}
                  name="Spot Price"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Info */}
        <div className="mt-6">
          <p className="text-sm text-black/60">
            <strong>Data Points:</strong> {data.length} | <strong>Status:</strong>{' '}
            {false ? 'Updating live (every 5s)' : 'Paused'}
          </p>
          <p className="text-xs text-black/50 block mt-2">
            Note: This is a simulation with dummy data for prototype purposes. Each strike represents
            combined Call + Put premium. Strike offsets are relative to ATM (±50 points per strike).
          </p>
        </div>
      </div>
    </div>
  );
};

export default StraddleVisualization;
