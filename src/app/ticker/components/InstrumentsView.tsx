
import DataTable from '@/components/DataTable';
import { Column } from '@/components/DataTable/types';
import { Button } from '@/components/ui/button';
import { useInstruments } from '@/hooks/useTickerFetch';
import { Instrument } from '@/models/ticker';
import { useMemo } from 'react';
import { instrumentsColumnBuilder } from './constants';

export default function InstrumentView() {
  // TODO: use shadcn data table to enable pagination
  const { reload, instruments } = useInstruments();
  const columns: Column<Instrument>[] = useMemo(instrumentsColumnBuilder, []);

  return (
    <div>
      <div className="flex justify-end">
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