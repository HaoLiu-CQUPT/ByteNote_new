"use client";

import { useEffect, useState } from "react";
import { isOnline, syncOfflineChanges, getSyncQueue } from "@/lib/offline";

export default function OfflineSync() {
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    success: number;
    failed: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setOnline(true);
      // Auto sync when coming back online
      handleSync();
    };
    const handleOffline = () => {
      setOnline(false);
      setSyncStatus(null);
    };

    setOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check sync queue on mount
    const queue = getSyncQueue();
    if (queue.length > 0 && navigator.onLine) {
      handleSync();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSync = async () => {
    if (!isOnline() || syncing) return;
    setSyncing(true);
    try {
      const result = await syncOfflineChanges();
      setSyncStatus(result);
      if (result.success > 0 || result.failed > 0) {
        // Refresh page after sync to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (e) {
      console.error("Sync failed:", e);
    } finally {
      setSyncing(false);
    }
  };

  const queue = typeof window !== "undefined" ? getSyncQueue() : [];
  const hasPendingSync = queue.length > 0;

  if (!hasPendingSync && online) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {!online ? (
        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
          <span>📴</span>
          <span>离线模式 - 更改将稍后同步</span>
        </div>
      ) : hasPendingSync ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
            <span>🔄</span>
            <span>{queue.length} 项待同步</span>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {syncing ? "同步中..." : "立即同步"}
          </button>
          {syncStatus && (
            <div className="text-[10px] text-gray-600 dark:text-gray-400">
              成功: {syncStatus.success} | 失败: {syncStatus.failed}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

