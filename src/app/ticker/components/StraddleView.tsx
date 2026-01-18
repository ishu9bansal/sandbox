
import DataTable from '@/components/DataTable';
import { Column } from '@/components/DataTable/types';
import { Button } from '@/components/ui/button';
import { useStraddles } from '@/hooks/useTickerFetch';
import { Straddle } from '@/models/ticker';
import { useCallback, useMemo } from 'react';
import { straddlesColumnBuilder } from './constants';
import { useAppDispatch } from '@/store/hooks';
import { setLiveTrackingIds } from '@/store/slices/tickerSlice';
import { toast } from 'sonner';

export default function StraddleView() {
  const { reload, straddles } = useStraddles('NIFTY');
  const columns: Column<Straddle>[] = useMemo(straddlesColumnBuilder, []);
  const dispatch = useAppDispatch();
  const onTrackPrices = useCallback((straddles: Straddle[]) => {
    dispatch(setLiveTrackingIds(straddles.map(s => s.id)));
    toast.success(`Tracking prices for ${straddles.length} straddles`);
  }, []);
  const bulkActions = useMemo(() => ([
    {
      key: 'straddle-track-prices',
      label: 'Track Prices',
      action: onTrackPrices,
    },
  ]), [onTrackPrices]);
  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={reload}>Reload Straddles</Button>
      </div>
      <DataTable
        title="Straddle List"
        data={straddles}
        columns={columns}
        getRowId={s => s.id}
        bulkActions={bulkActions}
      />
    </div>
  );
}