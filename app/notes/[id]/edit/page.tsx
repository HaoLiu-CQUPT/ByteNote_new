"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NoteEditor from "@/components/NoteEditor";

type Note = {
  id: number;
  title: string;
  content: string;
  categoryId: number | null;
  tags: { tagId: number }[];
};

export default function EditNotePage() {
  const params = useParams();
  const id = Number(params?.id);
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`/api/notes/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "加载失败");
        setNote({
          id: data.id,
          title: data.title,
          content: data.content,
          categoryId: data.categoryId ?? null,
          tags: data.tags.map((t: any) => ({ tagId: t.tag.id }))
        });
      } catch (e: any) {
        setErr(e.message || "加载失败");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    categoryId: number | null;
    tagIds: number[];
  }) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "更新失败");
    router.push(`/notes/${id}`);
  };

  if (loading) {
    return <p className="text-xs text-slate-400">加载中...</p>;
  }

  if (err) {
    return <p className="text-xs text-rose-400">{err}</p>;
  }

  if (!note) {
    return <p className="text-xs text-slate-400">未找到该笔记。</p>;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
          编辑笔记
        </h1>
        <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
          修改内容后点击底部「保存笔记」按钮。
        </p>
      </div>
      <NoteEditor
        initialTitle={note.title}
        initialContent={note.content}
        initialCategoryId={note.categoryId}
        initialTagIds={note.tags.map((t) => t.tagId)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}



