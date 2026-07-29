import { useState, type FormEvent } from "react";
import type { Tag, Task } from "../types/kanban";

type TaskEditorDialogProps = {
  task: Task | null;
  tags: Tag[];
  onCancel: () => void;
  onSave: (text: string, tagId: string, dueDate: string) => Promise<void>;
};

export function TaskEditorDialog({
  task,
  tags,
  onCancel,
  onSave,
}: TaskEditorDialogProps) {
  if (!task) return null;
  return (
    <TaskEditorForm
      key={task.id}
      task={task}
      tags={tags}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}

function TaskEditorForm({
  task,
  tags,
  onCancel,
  onSave,
}: Required<TaskEditorDialogProps> & { task: Task }) {
  const [text, setText] = useState(task.text);
  const [tagId, setTagId] = useState(task.tagId || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    await onSave(text, tagId, dueDate);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#090714]/75 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <form
        className="w-full max-w-[470px] rounded-2xl border border-[#5a4a7c] bg-[#171126] p-6 text-[#f5efff] shadow-[0_0_45px_#7df9ff35]"
        onSubmit={submit}
      >
        <p className="mb-2 text-[11px] font-extrabold tracking-[.15em] text-[#7df9ff]">
          EDIT TASK
        </p>
        <h2
          id="edit-task-title"
          className="mb-5 text-2xl font-bold tracking-[-.04em]"
        >
          Update your task
        </h2>
        <label className="mb-4 block text-xs font-bold tracking-[.08em] text-[#bdb5cf]">
          TASK TEXT
          <input
            className="mt-2 w-full rounded-lg border border-[#4a3d6e] bg-[#28203d] p-3 text-sm text-[#f5efff] outline-[#7df9ff]"
            value={text}
            onChange={(event) => setText(event.target.value)}
            autoFocus
          />
        </label>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold tracking-[.08em] text-[#bdb5cf]">
            TAG
            <select
              className="mt-2 w-full rounded-lg border border-[#4a3d6e] bg-[#28203d] p-3 text-sm text-[#f5efff] outline-[#7df9ff]"
              value={tagId}
              onChange={(event) => setTagId(event.target.value)}
            >
              <option value="">No tag</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-bold tracking-[.08em] text-[#bdb5cf]">
            DUE DATE
            <input
              className="mt-2 w-full rounded-lg border border-[#4a3d6e] bg-[#28203d] p-3 text-sm text-[#f5efff] [color-scheme:dark] outline-[#7df9ff]"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-bold text-[#bdb5cf] hover:bg-[#28203d]"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer rounded-lg bg-[#7df9ff] px-4 py-2.5 text-sm font-bold text-[#090714] shadow-[0_0_18px_#7df9ff80] hover:bg-[#b0fbff]"
            type="submit"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
