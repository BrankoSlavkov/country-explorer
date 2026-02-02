import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "~/hooks/use-online-status";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black shadow-lg">
      <WifiOff className="h-4 w-4" />
      <span>You're offline - showing cached data</span>
    </div>
  );
}
