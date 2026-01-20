
import { Button } from '@/components/ui/button';
import JsonView from '@/components/JsonView';
import Card from '@/components/compositions/card';
import { useTickerUser } from '@/hooks/useTickerFetch';

export default function HistoryView() {
  const { reload, user } = useTickerUser();
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={reload}>Reload User</Button>
      </div>
      <Card title="User Details" collapsible>
        <JsonView data={user} />
      </Card>
    </div>
  );
}
