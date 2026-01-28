
import { Button } from '@/components/ui/button';
import JsonView from '@/components/JsonView';
import { useZerodhaApis, useTickerUser } from '@/hooks/useTickerFetch';
import ActionCard from '@/components/compositions/action-card';
import { Input } from '@/components/ui/input';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UserView() {
  const { reload, user, loading: loadingUser } = useTickerUser();
  const [token, setToken] = useState('');
  const { pushToken, getLoginUrl, logout} = useZerodhaApis();
  const [loading, setLoading] = useState(false);
  const updateToken = useCallback(async () => {
    setLoading(true);
    try {
      await pushToken(token);
    } finally {
      setLoading(false);
    }
  }, [token, pushToken]);
  const { onLogin, onLogout, logoutLoading } = useZerodhaAuth(getLoginUrl, logout);
  return (
    <div className="space-y-6">
      <ActionCard
        title="User Token"
        actionChildren={<ActionButton
          onClick={updateToken}
          text='Update Token'
          loading={loading}
        />}
      >
        <Input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter new user token"
        />
      </ActionCard>
      <ActionCard
        title="User Details"
        actionChildren={<ActionButton
          onClick={reload}
          text='Reload User'
          loading={loadingUser}
        />}
      >
        <JsonView data={user} />
        <div className="mt-4 flex justify-end space-x-4">
          <Button size='lg' variant='link' onClick={onLogin}>Login to Zerodha</Button>
          <Button size='lg' variant='destructive' onClick={onLogout} disabled={logoutLoading}>
            Logout from Zerodha
          </Button>
        </div>
      </ActionCard>
    </div>
  );
}

type ActionButtonProps = {
  onClick: () => void;
  text: string;
  loading: boolean;
  loadingText?: string;
};
function ActionButton({ onClick, text, loading, loadingText }: ActionButtonProps) {
  const loadingTextFinal = loadingText || 'Loading...';
  return (
    <Button onClick={onClick} disabled={loading}>
      {loading ? loadingTextFinal : text}
    </Button>
  );
}

function useZerodhaAuth(getLoginUrl: () => Promise<string | null>, logout: () => Promise<void>) {
  const [loginUrl, setLoginUrl] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  useEffect(() => {
    const fetchLoginUrl = async () => {
      const urlResponse = await getLoginUrl();
      setLoginUrl(urlResponse);
    };
    fetchLoginUrl();
  }, [getLoginUrl]);
  const onLogin = useCallback(() => {
    if (!loginUrl) {
      toast.error("Login URL not available");
      return;
    }
    window.open(loginUrl, '_blank');    // open in new tab
    // window.location.href = loginUrl; // alternatively, redirect current tab
  }, [loginUrl]);

  const onLogout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } finally {
      setLogoutLoading(false);
    }
  },[logout]);
  return { onLogin, onLogout, logoutLoading };
}
