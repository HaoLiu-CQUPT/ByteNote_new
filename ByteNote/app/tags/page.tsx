"use client";

import { useEffect, useState } from "react";

type Tag = {
  id: number;
  name: string;
  createdAt: string;
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const loadTags = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "加载失败");
      setTags(data.items || []);
    } catch (e: any) {
      setErr(e.message || "加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) {
      setErr("标签名称不能为空");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "创建失败");
      setNewName("");
      await loadTags();
    } catch (e: any) {
      setErr(e.message || "创建失败");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) {
      setErr("标签名称不能为空");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "更新失败");
      setEditingId(null);
      setEditingName("");
      await loadTags();
    } catch (e: any) {
      setErr(e.message || "更新失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确认删除该标签？删除后相关笔记的该标签将被移除。")) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "删除失败");
      await loadTags();
    } catch (e: any) {
      setErr(e.message || "删除失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
          标签管理
        </h1>
        <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
          创建和管理笔记标签，为笔记添加多个标签以便分类和检索。
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mb-3 text-xs font-medium text-gray-700 dark:text-slate-300">
          新建标签
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="输入标签名称，例如：React、TypeScript、学习"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleCreate();
              }
            }}
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            创建
          </button>
        </div>
      </div>

      {err && (
        <p className="text-xs text-red-600 dark:text-red-400">{err}</p>
      )}

      {loading && tags.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-slate-400">加载中...</p>
      )}

      {!loading && tags.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-slate-400">
          暂无标签，请创建第一个标签。
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/70"
          >
            {editingId === tag.id ? (
              <div className="flex flex-1 items-center gap-2">
                <input
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void handleUpdate(tag.id);
                    } else if (e.key === "Escape") {
                      setEditingId(null);
                      setEditingName("");
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={() => void handleUpdate(tag.id)}
                  className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingName("");
                  }}
                  className="rounded bg-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-400 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  取消
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-slate-50">
                      #{tag.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400">
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => void handleDelete(tag.id)}
                    className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                  >
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

