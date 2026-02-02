import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const controller = new AbortController();
  window.addEventListener("online", callback, { signal: controller.signal });
  window.addEventListener("offline", callback, { signal: controller.signal });
  return () => controller.abort();
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
