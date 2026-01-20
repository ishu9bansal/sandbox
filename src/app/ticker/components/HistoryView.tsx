
import JsonView from '@/components/JsonView';
import Card from '@/components/compositions/card';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/compositions/date-picker';
import { SelectInput } from '@/components/compositions/select-input';
import { useHistory } from '@/hooks/useTickerFetch';
import { Button } from '@/components/ui/button';


const MARKET_OPEN_TIME = '09:15:00';
const MARKET_CLOSE_TIME = '15:30:00';
const TODAY = new Date();

export default function HistoryView() {
  const [date, setDate] = useState(TODAY);
  const [startTime, setStartTime] = useState(MARKET_OPEN_TIME);
  const [endTime, setEndTime] = useState(MARKET_CLOSE_TIME);
  const [underlying, setUnderlying] = useState<'NIFTY' | 'SENSEX'>('NIFTY');

  const { from, to } = useMemo(() => calLimits(date, startTime, endTime), [date, startTime, endTime]);
  const { reload, history } = useHistory(underlying, from, to);

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
        <Button onClick={reload}>Reload History</Button>
      </div>
      <Card title="Selected Details" collapsible>
        <JsonView data={{ date, startTime, endTime, underlying, history }} />
      </Card>
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
