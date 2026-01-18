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
import { OHLC, PriceSnapshot, StraddleQuote } from '@/models/ticker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectLiveTrackingIds, selectStraddleData, setLocalState } from '@/store/slices/tickerSlice';
import { buildSimulatedState } from '@/utils/ticker';

const MARKET_OPEN_TIME = '09:15:00';
const MARKET_CLOSE_TIME = '15:30:00';
const HALF_HOUR_MS = 30 * 60 * 1000;

const TickerView = () => {
  const [isLive, setIsLive] = useState(false);
  const straddleIds = useAppSelector(selectLiveTrackingIds);
  const pricesMap = useAppSelector(selectStraddleData(straddleIds));
  const { data: stockData } = useLiveData(isLive ? 1000 : 0); // Fetch every second if live
  const chartData = buildChartData(stockData, pricesMap);
  const lastDataPoint = chartData.length > 0 ? chartData[chartData.length - 1] : null;
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

  const dispatch = useAppDispatch();
  const setAllData = useCallback((seconds: number) => {
    dispatch(setLocalState(buildSimulatedState(seconds)));
  }, []);
  const onSimulate = useCallback(() => {
    setAllData(15*60); // Last 15 minutes
  }, [setAllData]);

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
          {/* Live Toggle */}
          <Button
            variant={isLive ? 'destructive' : 'default'}
            onClick={() => {
              setIsLive(prev => !prev);
              if (!isLive) setAllData(0); // Clear data when starting live
            }}
          >
            {isLive ? 'Stop Live' : 'Start Live'}
          </Button>
          <Button
            onClick={onSimulate}
          >
            Set simulated data
          </Button>
        </div>

        {/* Chart */}
        <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded">
          {(
            <Chart
              chartData={chartData}
              xAxisDomain={xAxisDomain}
              straddleIds={straddleIds}
            />
          )}
        </div>

        {/* Info */}
        <div className="mt-6">
          <p className="text-sm text-black/60">
            <strong>Data Points:</strong> {chartData.length} | <strong>Status:</strong>{' '}
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

function Chart({ chartData, xAxisDomain, straddleIds }: { chartData: PriceDataPoint[]; xAxisDomain: [number, number]; straddleIds?: string[] }) {
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
            const date = new Date(value);
            const isoDate = date.toISOString().split('T')[0];
            return `${isoDate} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
          }}
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
        {straddleIds?.map((key, i) => (
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
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="NIFTY"
          stroke="#FF5733"
          strokeWidth={3}
          dot={false}
          name="Spot Price"
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ExtraLines({ ids }: { ids: string[] }) {
  // NOTE: Making a separate component for sub chart is not working with Recharts
  // need to debug this later. For now, keep it in main Chart component.
  return (
    <>
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
      {ids.map((key) => (
        <Line
          key={key}
          yAxisId="left"
          type="monotone"
          dataKey={key}
          stroke="rgba(99, 179, 237, 0.4)"
          strokeWidth={1.5}
          dot={false}
          name={key}
        />
      ))}
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
            {entry.name}: {'₹'}
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

type PriceDataPoint = { timestamp: number; } & Record<string, number>;
function buildChartData(data: PriceSnapshot[], pricesMap: Record<string, StraddleQuote[]>): PriceDataPoint[] {
  const stockPrices: PriceDataPoint[] = data.map(snapshot => ({
    timestamp: snapshot.timestamp,
    'NIFTY': snapshot.price,
  }));
  // Add straddle prices for this timestamp
  const straddlePrices = Object.entries(pricesMap).map(([id, quotes]) => quotes.map(quote => ({
    timestamp: quote.timestamp,
    [id]: quote.price,
  }))).flat();
  // return straddlePrices;
  // return stockPrices;
  const chartData = stockPrices.concat(straddlePrices);
  const groupedResults = groupByTimestamp(chartData, roundToNearest(30*SECOND));
  return Object.entries(groupedResults).map(([timestampStr, values]) => ({
    timestamp: Number(timestampStr),
    ...Object.fromEntries(
      Object.entries(values).map(([key, ohlc]) => [key, ohlc.close])
    ),
  })).sort((a, b) => a.timestamp - b.timestamp);
}

function groupByTimestamp(data: PriceDataPoint[], rounding: (timestamp: number) => number = ((t) => t)) {
  const sortedData = data.sort((a, b) => a.timestamp - b.timestamp);
  const grouped: Record<number, Record<string, number[]>> = {};
  sortedData.forEach(point => {
    const timestamp = rounding(point.timestamp);
    if (!grouped[timestamp]) {
      grouped[timestamp] = {};
    }
    Object.entries(point).forEach(([key, value]) => {
      if (key !== 'timestamp') {
        if (!grouped[timestamp][key]) {
          grouped[timestamp][key] = [];
        }
        grouped[timestamp][key].push(value);
      }
    });
  });
  const result: Record<number, Record<string, OHLC>> = {};
  Object.entries(grouped).forEach(([timestampStr, values]) => {
    const timestamp = Number(timestampStr);
    result[timestamp] = {};
    Object.entries(values).forEach(([key, vals]) => {
      const open = vals[0];
      const close = vals[vals.length - 1];
      const high = Math.max(...vals);
      const low = Math.min(...vals);
      result[timestamp][key] = { open, high, low, close };
    });
  });
  return result;
}

function roundToNearest(interval: number): (timestamp: number) => number {
  return (timestamp: number) => Math.round(timestamp / interval) * interval;
}
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const FIVE_MINUTES = 5 * MINUTE;
const FIFTEEN_MINUTES = 15 * MINUTE;
const THIRTY_MINUTES = 30 * MINUTE;
const ONE_HOUR = 60 * MINUTE;
const TWO_HOURS = 2 * ONE_HOUR;
const FOUR_HOURS = 4 * ONE_HOUR;

const COLOR_PALETTE = [
  '#33FF57', // Green
  '#3357FF', // Blue
  '#F333FF', // Magenta
  '#33FFF5', // Cyan
  '#F5FF33', // Yellow
  '#FF33A8', // Pink
  '#A833FF', // Purple
];
