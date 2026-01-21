
import JsonView from '@/components/JsonView';
import Card from '@/components/compositions/card';
import { useCallback, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/compositions/date-picker';
import { SelectInput } from '@/components/compositions/select-input';
import { useHistory, useStraddleHistory } from '@/hooks/useTickerFetch';
import { Button } from '@/components/ui/button';
import { OHLC, PricePoint } from '@/models/ticker';
import Chart, { ChartProps } from './Chart';
import { useAppSelector } from '@/store/hooks';
import { selectLiveQuotes, selectLiveTrackingIds } from '@/store/slices/tickerSlice';


const MARKET_OPEN_TIME = '09:15:00';
const MARKET_CLOSE_TIME = '15:30:00';
const TODAY = getTodayDate();

export default function HistoryView() {
  const debugMode = false;
  const autoReload = true;
  const [date, setDate] = useState(TODAY);
  const [startTime, setStartTime] = useState(MARKET_OPEN_TIME);
  const [endTime, setEndTime] = useState(MARKET_CLOSE_TIME);
  const [underlying, setUnderlying] = useState<'NIFTY' | 'SENSEX'>('NIFTY');
  const straddleIds = useAppSelector(selectLiveTrackingIds);

  const { from, to } = useMemo(() => calLimits(date, startTime, endTime), [date, startTime, endTime]);
  const { reload, history } = useHistory(autoReload, underlying, from, to);
  const { reloadHistories, histories } = useStraddleHistory(autoReload, straddleIds, from, to);
  const { reloadLive, liveQuotes } = useLiveQuotes(from, to, [underlying, ...straddleIds]);
  const onReload = useCallback(() => {
    reload();
    reloadHistories();
    reloadLive();
  }, [reload, reloadHistories]);

  const { chartData, primaryKeys, secondaryKeys } = useMemo(() => {
    return buildChartData(history, underlying, histories, straddleIds, liveQuotes);
  }, [history, underlying, histories, straddleIds]);
  const xAxisDomain: [number, number] = useMemo(
    () => [from.getTime(), to.getTime()],
    [from, to]
  );  // using from and to directly as they are stable references

  return (
    <div>
      <div className="flex items-center mb-4 space-x-4">
        <DatePicker date={date} onDateChange={(d) => setDate(d || TODAY)} />
        <Input
          type='time'
          step={1}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-auto"
        />
        <span className="text-black/60">-</span>
        <Input
          type='time'
          step={1}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-auto"
        />
        <SelectInput
          value={underlying}
          onChange={(value) => setUnderlying(value as 'NIFTY' | 'SENSEX')}
          options={['NIFTY', 'SENSEX']}
        />
        <Button onClick={onReload}>Reload History</Button>
      </div>
      <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded">
        <Chart
          chartData={chartData}
          xAxisDomain={xAxisDomain}
          primaryKeys={primaryKeys}
          secondaryKeys={secondaryKeys}
        />
      </div>
      {
        debugMode && (
          <Card title="State Details" collapsible>
            <JsonView data={{
              date,
              startTime,
              endTime,
              underlying,
              primaryKeys,
              secondaryKeys,
              xAxisDomain,
              history,
              chartData,
              straddleIds,
              histories,
            }} />
          </Card>
        )
      }
    </div>
  );
}

function useLiveQuotes(from: Date, to: Date, ids: string[]) {
  const liveQuotes = useAppSelector(selectLiveQuotes);
  return { liveQuotes, reloadLive: () => {} };
}

function calLimits(date: Date, startTime: string, endTime: string) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const [startHour, startMinute, startSecond] = startTime.split(':').map(Number);
  const from = new Date(year, month, day, startHour, startMinute, startSecond);

  const [endHour, endMinute, endSecond] = endTime.split(':').map(Number);
  const to = new Date(year, month, day, endHour, endMinute, endSecond);

  return { from, to };
}


function buildChartData(history: PricePoint[], underlying: string, histories: Record<string, PricePoint[]>, straddleIds: string[], extraData: Record<string, PricePoint[]>): ChartProps {
  histories[underlying] = history; // include underlying history for ease of access
  const bucketedData: Record<number, Record<string, PricePoint[]>> = {};
  const entries = Object.entries(extraData).concat(Object.entries(histories));
  entries.forEach(([id, records]) => {
    records.forEach(record => {
      const timeKey = timeBucket(record.timestamp);
      if (!bucketedData[timeKey]) {
        bucketedData[timeKey] = {};
      }
      if (!bucketedData[timeKey][id]) {
        bucketedData[timeKey][id] = [];
      }
      bucketedData[timeKey][id].push(record);
    });
  });
  const dataPoints = Object.entries(bucketedData).map(([timeKey, recordsMap]) => {
    const timestamp = Number(timeKey);
    const ohlcData = buildBucketPoint(recordsMap);
    const priceMap = Object.fromEntries(Object.entries(ohlcData).map(([id, ohlc]) => [id, ohlc.close]));
    return { timestamp, ...priceMap };
  });
  const chartData = dataPoints.sort((a, b) => a.timestamp - b.timestamp);
  const firstTimestamp = chartData[0]?.timestamp || 0;
  const lastTimestamp = chartData[chartData.length - 1]?.timestamp || 0;
  const xAxisDomain: [number, number] = [firstTimestamp, lastTimestamp];
  const secondaryKeys = straddleIds;
  const primaryKeys = [underlying];
  return { chartData, primaryKeys, secondaryKeys, xAxisDomain };
}

function buildBucketPoint(recordsMap: Record<string, PricePoint[]>): Record<string, OHLC> {
  const dataPoint: Record<string, OHLC> = {};
  Object.entries(recordsMap).forEach(([id, records]) => {
    if (records.length === 0) return;
    records.sort((a, b) => a.timestamp - b.timestamp);
    const open = records[0].price;
    const close = records[records.length - 1].price;
    const high = Math.max(...records.map(r => r.price));
    const low = Math.min(...records.map(r => r.price));
    dataPoint[id] = { open, high, low, close };
  });
  return dataPoint;
}
function timeBucket(timestamp: number, bucketSizeMs: number = 1000): number {
  return Math.floor(timestamp / bucketSizeMs) * bucketSizeMs;
}

function getTodayDate() {
  const now = new Date();
  if (now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() < 15)) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  }
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
