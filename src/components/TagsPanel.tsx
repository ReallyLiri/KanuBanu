import { useState, type FormEvent } from "react";
import type { Tag, Task } from "../types/kanban";
type TagsPanelProps = {
  tags: Tag[];
  tasks: Task[];
  onCreate: (name: string) => Promise<void>;
  onUpdate: (tag: Tag) => Promise<void>;
  onDelete: (tag: Tag) => Promise<void>;
};
export function TagsPanel({
  tags,
  tasks,
  onCreate,
  onUpdate,
  onDelete,
}: TagsPanelProps) {
  const [name, setName] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    await onCreate(name);
    setName("");
  }
  return (
    <section className="mt-[45px] block border-t border-[#41385d] pt-[29px] sm:mt-[72px] sm:flex sm:items-start sm:gap-20">
      <div>
        <h2 className="text-[22px] font-bold tracking-[-.04em] text-[#f5efff]">
          Tags
        </h2>
      </div>
      <div className="mt-[17px] flex flex-1 flex-wrap gap-2 sm:mt-0">
        {tags.map((tag) => (
          <EditableTag
            key={tag.id}
            tag={tag}
            onUpdate={onUpdate}
            onDelete={onDelete}
            assigned={tasks.some((task) => task.tagId === tag.id)}
          />
        ))}
        <form
          onSubmit={submit}
          className="flex h-[34px] overflow-hidden rounded-md border border-[#4a3d6e] bg-[#211a33]"
        >
          <input
            className="w-[89px] border-0 bg-transparent px-2 text-xs text-[#f5efff] outline-0 placeholder:text-[#8f86aa]"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="New tag"
          />
          <button
            className="cursor-pointer bg-[#b8a1ff] px-[17px] text-xs font-bold text-[#090714]"
            type="submit"
          >
            + Add
          </button>
        </form>
      </div>
    </section>
  );
}
function EditableTag({
  tag,
  onUpdate,
  onDelete,
  assigned,
}: {
  tag: Tag;
  onUpdate: (tag: Tag) => Promise<void>;
  onDelete: (tag: Tag) => Promise<void>;
  assigned: boolean;
}) {
  const [draft, setDraft] = useState(tag);
  return (
    <div className="flex h-[34px] overflow-hidden rounded-md border border-[#4a3d6e] bg-[#211a33]">
      <input
        className="w-[97px] border-0 bg-transparent px-2 text-xs text-[#f5efff] outline-0"
        value={draft.name}
        onChange={(event) => setDraft({ ...draft, name: event.target.value })}
        onBlur={() => onUpdate(draft)}
      />
      <input
        className="w-7 border-0 bg-transparent p-[3px]"
        type="color"
        value={draft.color}
        onChange={(event) => {
          const updated = { ...draft, color: event.target.value };
          setDraft(updated);
          onUpdate(updated);
        }}
      />
      <button
        className="cursor-pointer border-l border-[#4a3d6e] px-2 text-xs text-[#ff9ed8] hover:bg-[#3a1d3c] disabled:cursor-not-allowed disabled:text-[#685c87] disabled:hover:bg-transparent"
        type="button"
        disabled={assigned}
        title={
          assigned
            ? "Remove this tag from its tasks before deleting it"
            : "Delete tag"
        }
        onClick={() => onDelete(tag)}
        aria-label={`Delete ${tag.name} tag`}
      >
        ×
      </button>
    </div>
  );
}
