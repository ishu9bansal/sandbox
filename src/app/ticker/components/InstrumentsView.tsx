
import DataTable from '@/components/DataTable';
import { columnsBuilder } from '@/components/DataTable/columns';
import { Column } from '@/components/DataTable/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInstruments, useTickerHealthStatus } from '@/hooks/useTickerFetch';
import { Instrument } from '@/models/ticker';
import { useAppSelector } from '@/store/hooks';
import { selectInstruments } from '@/store/slices/tickerSlice';
import { BadgeAlertIcon, BadgeCheckIcon } from 'lucide-react';
import { useMemo } from 'react';

export default function InstrumentView() {
  const healthy = useTickerHealthStatus();
  const instruments = useAppSelector(selectInstruments);
  const reload = useInstruments();

  const columns: Column<Instrument>[] = useMemo(() => columnsBuilder(
    {
      key: 'name',
      header: 'Underlying',
      sortable: true,
      filterable: true,
    },
    {
      key: 'expiry',
      header: 'Expiry',
      sortable: true,
      filterable: true,
    },
    {
      key: 'strike',
      header: 'Strike',
      sortable: true,
      filterable: true,
    },
    {
      key: 'instrument_type',
      header: 'Option Type',
      sortable: true,
      filterable: true,
    },
  ), []);

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