// Offline storage and sync utilities
const OFFLINE_PREFIX = "offline_note_";
const SYNC_QUEUE_KEY = "sync_queue";

export type OfflineNote = {
  id?: number;
  title: string;
  content: string;
  categoryId: number | null;
  tagIds: number[];
  isNew: boolean;
  timestamp: number;
};

export type SyncItem = {
  type: "create" | "update" | "delete";
  noteId?: number;
  data?: OfflineNote;
  timestamp: number;
};

// Helper to check if we're in browser
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Save note to offline storage
export function saveOfflineNote(note: OfflineNote): string {
  if (!isBrowser()) return "";
  const id = note.id ? String(note.id) : `temp_${Date.now()}`;
  const key = `${OFFLINE_PREFIX}${id}`;
  localStorage.setItem(key, JSON.stringify({ ...note, id, timestamp: Date.now() }));
  return id;
}

// Get offline note
export function getOfflineNote(id: string): OfflineNote | null {
  if (!isBrowser()) return null;
  const key = `${OFFLINE_PREFIX}${id}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Get all offline notes
export function getAllOfflineNotes(): OfflineNote[] {
  if (!isBrowser()) return [];
  const notes: OfflineNote[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(OFFLINE_PREFIX)) {
      const data = localStorage.getItem(key);
      if (data) {
        notes.push(JSON.parse(data));
      }
    }
  }
  return notes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

// Add to sync queue
export function addToSyncQueue(item: SyncItem): void {
  if (!isBrowser()) return;
  const queue = getSyncQueue();
  queue.push(item);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

// Get sync queue
export function getSyncQueue(): SyncItem[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(SYNC_QUEUE_KEY);
  return data ? JSON.parse(data) : [];
}

// Clear sync queue
export function clearSyncQueue(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(SYNC_QUEUE_KEY);
}

// Remove sync item
export function removeSyncItem(index: number): void {
  if (!isBrowser()) return;
  const queue = getSyncQueue();
  queue.splice(index, 1);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

// Check if online
export function isOnline(): boolean {
  if (!isBrowser()) return true;
  return navigator.onLine;
}

// Sync offline changes
export async function syncOfflineChanges(): Promise<{
  success: number;
  failed: number;
}> {
  if (!isOnline()) {
    return { success: 0, failed: 0 };
  }

  const queue = getSyncQueue();
  let success = 0;
  let failed = 0;

  for (let i = queue.length - 1; i >= 0; i--) {
    const item = queue[i];
    try {
      if (item.type === "create" && item.data) {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data)
        });
        if (res.ok) {
          const saved = await res.json();
          // Update local storage with real ID
          if (item.noteId && isBrowser()) {
            const oldKey = `${OFFLINE_PREFIX}${item.noteId}`;
            const newKey = `${OFFLINE_PREFIX}${saved.id}`;
            const oldData = localStorage.getItem(oldKey);
            if (oldData) {
              localStorage.removeItem(oldKey);
              localStorage.setItem(newKey, JSON.stringify({ ...JSON.parse(oldData), id: saved.id, isNew: false }));
            }
          }
          success++;
          removeSyncItem(i);
        } else {
          failed++;
        }
      } else if (item.type === "update" && item.data && item.noteId) {
        const res = await fetch(`/api/notes/${item.noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data)
        });
        if (res.ok) {
          success++;
          removeSyncItem(i);
        } else {
          failed++;
        }
      } else if (item.type === "delete" && item.noteId) {
        const res = await fetch(`/api/notes/${item.noteId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          success++;
          removeSyncItem(i);
        } else {
          failed++;
        }
      }
    } catch (e) {
      failed++;
    }
  }

  return { success, failed };
}

