import { Badge } from "@/components/ui/badge";
import { useTickerHealthStatus } from "@/hooks/useTickerFetch";
import { BadgeAlertIcon, BadgeCheckIcon } from "lucide-react";

export default function TickerHealth() {
  const healthy = useTickerHealthStatus();
  return (
    <>
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
    </>
  )
}