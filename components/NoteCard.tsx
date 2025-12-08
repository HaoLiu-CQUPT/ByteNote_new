import Link from "next/link";

type NoteItem = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: number; name: string } | null;
  tags: { tag: { id: number; name: string } }[];
};

type Props = {
  note: NoteItem;
  renderExcerpt: (content: string) => string;
};

export default function NoteCard({ note, renderExcerpt }: Props) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 text-xs text-gray-700 shadow-md shadow-gray-200/50 transition hover:-translate-y-0.5 hover:border-blue-500 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:shadow-slate-950/60 dark:hover:border-sky-500 dark:hover:bg-slate-900/80"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-sky-300">
          {note.title}
        </div>
        <div className="shrink-0 text-[10px] text-gray-500 dark:text-slate-500">
          {new Date(note.updatedAt).toLocaleDateString()}
        </div>
      </div>
      <div className="mt-1 text-[11px] text-slate-400">
        {note.category && (
          <span className="mr-2 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-200">
            {note.category.name}
          </span>
        )}
        {note.tags.map((t) => (
          <span
            key={t.tag.id}
            className="mr-1 rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] text-sky-300"
          >
            #{t.tag.name}
          </span>
        ))}
      </div>
      <p className="mt-2 line-clamp-3 text-[11px] text-gray-600 dark:text-slate-300">
        {renderExcerpt(note.content)}
      </p>
    </Link>
  );
}

