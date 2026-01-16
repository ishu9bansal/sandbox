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
import { useLiveData } from '@/hooks/useTickerFetch';
import { useCallback, useState } from 'react';
import { PriceSnapshot } from '@/models/ticker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react';

const MARKET_OPEN_TIME = '09:15:00';
const MARKET_CLOSE_TIME = '15:30:00';
const HALF_HOUR_MS = 30 * 60 * 1000;

const TickerView = () => {
  const showExtraLines = false;
  const { data } = useLiveData(1000);
  const chartData = data;
  const lastDataPoint = data.length > 0 ? data[data.length - 1] : null;
  const lastTimestamp = lastDataPoint ? new Date(lastDataPoint.timestamp) : new Date();
  const [startTime, setStartTime] = useState(MARKET_OPEN_TIME);
  const [endTime, setEndTime] = useState(MARKET_CLOSE_TIME);
  const defaultZoom = startTime === MARKET_OPEN_TIME && endTime === MARKET_CLOSE_TIME;
  const xAxisDomain: [number, number] = zoomDomain(lastTimestamp, startTime, endTime);
  const set30minZoom = useCallback(() => {
    setStartTime(formatTime(lastTimestamp.getTime() - HALF_HOUR_MS));
    setEndTime(formatTime(lastTimestamp.getTime() + HALF_HOUR_MS));
  }, [lastTimestamp]);
  const setDefaultZoom = useCallback(() => {
    setStartTime(MARKET_OPEN_TIME);
    setEndTime(MARKET_CLOSE_TIME);
  }, []);
  const toggleZoomLevel = useCallback(() => {
    if (defaultZoom) {
      set30minZoom();
    } else {
      setDefaultZoom();
    }
  }, [defaultZoom, set30minZoom, setDefaultZoom]);

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
        <div className="flex items-center mb-4 space-x-4">
          <Button onClick={toggleZoomLevel}>
            {defaultZoom ? <ZoomInIcon /> : <ZoomOutIcon />}
          </Button>
          <Input
            type='time'
            step={1}
            min={MARKET_OPEN_TIME}
            max={endTime}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-auto"
          />
          <span className="text-black/60">-</span>
          <Input
            type='time'
            step={1}
            max={MARKET_CLOSE_TIME}
            min={startTime}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-auto"
          />
        </div>

        {/* Chart */}
        <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded">
          {data.length === 0 ? (
            <div className="h-[600px] flex items-center justify-center">
              <p className="text-xl text-black/50">
                Click "Start Simulation" to begin monitoring
              </p>
            </div>
          ) : (
            <Chart
              chartData={chartData}
              xAxisDomain={xAxisDomain}
              showExtraLines={showExtraLines}
            />
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

function Chart({ chartData, xAxisDomain, showExtraLines }: { chartData: PriceSnapshot[]; xAxisDomain: [number, number]; showExtraLines: boolean; }) {
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
          tickFormatter={(value, index) => {
            if (!index) console.log('Formatting tick value:', new Date());
            const date = new Date(value);
            return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
          }}
          domain={xAxisDomain}
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
        {showExtraLines && <ExtraLines />}
        {/* Spot Price Line - Lighter, on right axis */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="price"
          stroke="rgba(255, 0, 0, 0.5)"
          strokeWidth={1.5}
          dot={false}
          name="Spot Price"
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ExtraLines() {
  return (
    <>
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
    </>
  );
}

export default TickerView;


function zoomDomain(now: Date, startTime: string, endTime: string): [number, number] {
  const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
  const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);

  const startDate = new Date(now);
  startDate.setHours(startHours, startMinutes, startSeconds, 0);

  const endDate = new Date(now);
  endDate.setHours(endHours, endMinutes, endSeconds, 0);
  return [startDate.getTime(), endDate.getTime()];
}

// Custom tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{name: string; value: number; color: string; payload?: {timestamp: number}}>}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-4 bg-black/90 border border-white/20 rounded"
      >
        <p className="text-black text-sm mb-2">
          Time: {payload[0]?.payload?.timestamp ? new Date(payload[0].payload.timestamp).toLocaleTimeString() : ''}
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

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}