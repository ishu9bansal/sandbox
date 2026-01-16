
import DataTable from '@/components/DataTable';
import { Column } from '@/components/DataTable/types';
import { Button } from '@/components/ui/button';
import { useStraddles } from '@/hooks/useTickerFetch';
import { Straddle } from '@/models/ticker';
import { useMemo } from 'react';
import { straddlesColumnBuilder } from './constants';

export default function StraddleView() {
  const { reload, straddles } = useStraddles('NIFTY');
  const columns: Column<Straddle>[] = useMemo(straddlesColumnBuilder, []);
  const straddleKey = (straddle: Straddle) => {
    return `${straddle.underlying}-${straddle.expiry}-${straddle.strike}`;
  };

  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={reload}>Reload Straddles</Button>
      </div>
      <DataTable
        title="Straddle List"
        data={straddles}
        columns={columns}
        getRowId={straddleKey}
      />
    </div>
  );
}