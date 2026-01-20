
import JsonView from '@/components/JsonView';
import Card from '@/components/compositions/card';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/compositions/date-picker';
import { SelectInput } from '@/components/compositions/select-input';


const MARKET_OPEN_TIME = '09:15:00';
const MARKET_CLOSE_TIME = '15:30:00';
const TODAY = new Date();

export default function HistoryView() {
  const [date, setDate] = useState(TODAY);
  const [startTime, setStartTime] = useState(MARKET_OPEN_TIME);
  const [endTime, setEndTime] = useState(MARKET_CLOSE_TIME);
  const [underlying, setUnderlying] = useState<'NIFTY' | 'SENSEX'>('NIFTY');
  
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
      </div>
      <Card title="Selected Details" collapsible>
        <JsonView data={{ date, startTime, endTime, underlying }} />
      </Card>
    </div>
  );
}
