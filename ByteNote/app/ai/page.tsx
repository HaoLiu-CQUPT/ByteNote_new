// AI 功能已全部禁用
"use client";

export default function AIPage() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
          AI 智能功能
        </h1>
        <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
          AI 功能已禁用
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-sm text-gray-600 dark:text-slate-400">
          AI 功能已全部禁用。如需恢复，请取消注释相关代码。
        </p>
      </div>
    </div>
  );
}
