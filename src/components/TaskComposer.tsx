import { useState, type FormEvent } from "react";
import type { Tag } from "../types/kanban";
type TaskComposerProps = {
  tags: Tag[];
  onCreate: (text: string, tagId: string, dueDate: string) => Promise<void>;
};
export function TaskComposer({ tags, onCreate }: TaskComposerProps) {
  const [text, setText] = useState("");
  const [tagId, setTagId] = useState("");
  const [dueDate, setDueDate] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    await onCreate(text, tagId, dueDate);
    setText("");
    setTagId("");
    setDueDate("");
  }
  return (
    <form
      className="mb-9 grid grid-cols-2 gap-[9px] rounded-[11px] border border-[#4a3d6e] bg-[#171126] p-2.5 shadow-[0_0_24px_#b8a1ff1f] sm:grid-cols-[1fr_145px_138px_auto]"
      onSubmit={submit}
    >
      <input
        className="col-span-2 min-w-0 rounded-[7px] bg-[#28203d] p-2.5 text-[#f5efff] outline-[#7df9ff] placeholder:text-[#8f86aa] sm:col-span-1"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs to be done?"
        aria-label="Task text"
      />
      <select
        className="min-w-0 rounded-[7px] bg-[#28203d] p-2.5 text-[#f5efff] outline-[#7df9ff]"
        value={tagId}
        onChange={(event) => setTagId(event.target.value)}
        aria-label="Tag"
      >
        <option value="">No tag</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
      <input
        className="min-w-0 rounded-[7px] bg-[#28203d] p-2.5 text-[#f5efff] [color-scheme:dark] outline-[#7df9ff]"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        aria-label="Due date"
      />
      <button
        className="cursor-pointer rounded-[7px] bg-[#ff9ed8] px-4 py-2.5 font-bold text-[#090714] shadow-[0_0_16px_#ff9ed880] hover:bg-[#ffd0ec]"
        type="submit"
      >
        Add task
      </button>
    </form>
  );
}
