
import { Button } from '@/components/ui/button';
import JsonView from '@/components/JsonView';
import { usePushTokenApi, useTickerUser } from '@/hooks/useTickerFetch';
import ActionCard from '@/components/compositions/action-card';
import { Input } from '@/components/ui/input';
import { useCallback, useState } from 'react';

export default function UserView() {
  const { reload, user } = useTickerUser();
  const [token, setToken] = useState('');
  const pushToken = usePushTokenApi();
  const updateToken = useCallback(async () => {
    await pushToken(token);
  }, [token, pushToken]);
  return (
    <div className="space-y-6">
      <ActionCard title="User Token" actionChildren={<Button onClick={updateToken}>Update Token</Button>} >
        <Input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter new user token"
        />
      </ActionCard>
      <ActionCard title="User Details" actionChildren={<Button onClick={reload}>Reload User</Button>}>
        <JsonView data={user} />
      </ActionCard>
    </div>
  );
}

