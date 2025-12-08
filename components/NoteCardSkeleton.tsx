// Loading skeleton for note cards
export default function NoteCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70 animate-pulse">
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-16 rounded bg-gray-200 dark:bg-slate-700" />
      </div>
      <div className="mt-2 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-slate-700" />
        <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-slate-700" />
      </div>
      <div className="mt-2 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

