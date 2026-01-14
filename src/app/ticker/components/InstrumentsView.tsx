
import DataTable from '@/components/DataTable';
import { Column } from '@/components/DataTable/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInstruments, useTickerHealthStatus } from '@/hooks/useTickerFetch';
import { Instrument } from '@/models/ticker';
import { useAppSelector } from '@/store/hooks';
import { selectInstruments } from '@/store/slices/tickerSlice';
import { BadgeAlertIcon, BadgeCheckIcon } from 'lucide-react';
import { useMemo } from 'react';
import { instrumentsColumnBuilder } from './constants';

export default function InstrumentView() {
  // TODO: use shadcn data table to enable pagination
  const healthy = useTickerHealthStatus();
  const instruments = useAppSelector(selectInstruments);
  const reload = useInstruments();
  const columns: Column<Instrument>[] = useMemo(instrumentsColumnBuilder, []);

  return (
    <div>
      <div className="flex justify-between">
      <div className="flex w-full flex-wrap gap-4 align-center">
        <h2>Instruments</h2>
        { healthy
        ? <Badge variant='default'>
            <BadgeCheckIcon size={12} />
            Healthy
          </Badge>
        : <Badge variant='outline'>
            <BadgeAlertIcon size={12} />
            Offline
          </Badge>
        }
      </div>
      <Button onClick={reload}>Reload Instruments</Button>
      </div>
      <DataTable
        title="Instrument List"
        data={instruments}
        columns={columns}
        getRowId={(i) => i.exchange_token}
      />
    </div>
  );
}