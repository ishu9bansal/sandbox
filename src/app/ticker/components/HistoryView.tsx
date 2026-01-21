
import JsonView from '@/components/JsonView';
import Card from '@/components/compositions/card';
import { useCallback, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/compositions/date-picker';
import { SelectInput } from '@/components/compositions/select-input';
import { useHistory, useStraddleHistory } from '@/hooks/useTickerFetch';
import { Button } from '@/components/ui/button';
import { HistoryRecord } from '@/models/ticker';
import Chart, { ChartProps } from './Chart';
import { useAppSelector } from '@/store/hooks';
import { selectLiveTrackingIds } from '@/store/slices/tickerSlice';


const MARKET_OPEN_TIME = '09:15:00';
const MARKET_CLOSE_TIME = '15:30:00';
const TODAY = getTodayDate();

export default function HistoryView() {
  const debugMode = true;
  const autoReload = false;
  const [date, setDate] = useState(TODAY);
  const [startTime, setStartTime] = useState(MARKET_OPEN_TIME);
  const [endTime, setEndTime] = useState(MARKET_CLOSE_TIME);
  const [underlying, setUnderlying] = useState<'NIFTY' | 'SENSEX'>('NIFTY');
  const straddleIds = useAppSelector(selectLiveTrackingIds);

  const { from, to } = useMemo(() => calLimits(date, startTime, endTime), [date, startTime, endTime]);
  const { reload, history } = useHistory(autoReload, underlying, from, to);
  const { reloadHistories, histories } = useStraddleHistory(autoReload, straddleIds, from, to);
  const onReload = useCallback(() => {
    reload();
    reloadHistories();
  }, [reload, reloadHistories]);

  const { chartData, primaryKeys, secondaryKeys } = useMemo(() => buildChartData(history, underlying), [history, underlying]);
  const xAxisDomain: [number, number] = useMemo(() => [from.getTime(), to.getTime()], [from, to]);  // using from and to directly as they are stable references

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


function buildChartData(history: HistoryRecord[], underlying: string): ChartProps {
  const secondaryKeys: string[] = []; // will add straddle prices later
  const primaryKeys = [underlying];
  const chartData = history.map(record => ({
    timestamp: record.timestamp,
    [underlying]: record.close,
  })).sort((a, b) => a.timestamp - b.timestamp);
  const firstTimestamp = chartData[0]?.timestamp || 0;
  const lastTimestamp = chartData[chartData.length - 1]?.timestamp || 0;
  const xAxisDomain: [number, number] = [firstTimestamp, lastTimestamp];
  return { chartData, primaryKeys, secondaryKeys, xAxisDomain };
}

function getTodayDate() {
  const now = new Date();
  if (now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() < 15)) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  }
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
