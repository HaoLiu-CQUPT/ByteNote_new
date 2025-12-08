import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid w-full gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center">
      <div className="flex flex-col gap-5">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] text-slate-700 shadow dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          实时 Markdown 预览 · 标签筛选 · 响应式布局
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl lg:text-4xl">
            欢迎使用
            <span className="ml-2 bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              ByteNote
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-[15px]">
            为开发者与学习者打造的云端知识库，支持 Markdown
            编辑与实时预览、分类与标签管理、搜索筛选与分页浏览，让你的零散笔记变成可结构化检索的知识体系。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2 text-sm font-medium text-slate-50 shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500"
          >
            立即注册，开始记录
          </Link>
          <Link
            href="/notes"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-100 hover:border-sky-500 hover:bg-slate-900"
          >
            查看示例笔记列表
          </Link>
        </div>
        <div className="mt-2 grid gap-3 text-[11px] text-slate-300 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="mb-1 text-xs font-semibold text-slate-100">
              完整笔记生命周期
            </div>
            <p className="leading-relaxed">
              支持从创建、编辑、删除到搜索、筛选与分页浏览的全流程管理。
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="mb-1 text-xs font-semibold text-slate-100">
              Markdown 实时预览
            </div>
            <p className="leading-relaxed">
              左侧编辑、右侧预览，所见即所得，适合技术笔记与学习总结。
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="mb-1 text-xs font-semibold text-slate-100">
              响应式多端体验
            </div>
            <p className="leading-relaxed">
              兼容桌面端与移动端，在任何设备上都能舒适阅读与编辑笔记。
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-2 hidden h-full md:block">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-500/20 via-blue-500/10 to-emerald-400/10 blur-2xl" />
        <div className="relative h-full rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-[11px] text-slate-300">
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="truncate">markdown-note.md</span>
          </div>
          <div className="mt-2 grid h-full gap-3 text-[11px] text-slate-200" style={{ gridTemplateColumns: "1.1fr 1.1fr" }}>
            <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-2 font-mono">
              <span className="text-[10px] text-sky-300">编辑区 · Markdown</span>
              <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-relaxed text-slate-200">
{`# 学习笔记：React Hooks

- useState 管理组件内部状态
- useEffect 处理副作用
- useMemo / useCallback 性能优化
`}
              </pre>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-2">
              <span className="text-[10px] text-emerald-300">
                预览区 · 渲染结果
              </span>
              <div className="mt-1 space-y-2 text-[11px] leading-relaxed">
                <div className="text-[13px] font-semibold text-slate-50">
                  学习笔记：React Hooks
                </div>
                <ul className="list-disc space-y-1 pl-4">
                  <li>useState 管理组件内部状态</li>
                  <li>useEffect 处理副作用</li>
                  <li>useMemo / useCallback 做性能优化</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}