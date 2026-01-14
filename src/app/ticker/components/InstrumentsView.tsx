
import DataTable from '@/components/DataTable';
import { columnsBuilder } from '@/components/DataTable/columns';
import { Column } from '@/components/DataTable/types';
import { useTickerFetch } from '@/hooks/useTickerFetch';
import { Instrument } from '@/models/ticker';
import { useAppSelector } from '@/store/hooks';
import { selectInstruments } from '@/store/slices/tickerSlice';
import { useMemo } from 'react';

export default function InstrumentView() {
  const instruments = useAppSelector(selectInstruments);
  const fetchInstruments = useTickerFetch();

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
      <h2>Instruments</h2>
      <button onClick={fetchInstruments}>Reload Instruments</button>
      <DataTable
        title="Instrument List"
        data={instruments}
        columns={columns}
        getRowId={(i) => i.exchange_token}
      />
    </div>
  );
}