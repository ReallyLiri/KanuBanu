import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import type {
  BoardColumn as BoardColumnType,
  Tag,
  Task,
} from "../types/kanban";

type BoardColumnProps = {
  column: BoardColumnType;
  tasks: Task[];
  tags: Tag[];
  onDone: (task: Task) => void;
  onEdit: (task: Task) => void;
};

export function BoardColumn({
  column,
  tasks,
  tags,
  onDone,
  onEdit,
}: BoardColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });
  return (
    <section className="min-h-[300px] rounded-xl border border-[#41385d] bg-[#171126] p-[17px] shadow-[0_0_24px_#7df9ff0d]">
      <header className="mx-0.5 mb-[15px] flex items-center gap-2">
        <span
          className="size-2 rounded-full shadow-[0_0_10px_currentColor]"
          style={{ background: column.accent, color: column.accent }}
        />
        <h2 className="text-[13px] font-bold tracking-[.06em] text-[#f5efff]">
          {column.name}
        </h2>
        <span className="ml-auto text-xs text-[#a79fba]">{tasks.length}</span>
      </header>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="grid min-h-[230px] content-start gap-[9px]"
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              tag={tags.find((tag) => tag.id === task.tagId)}
              onDone={onDone}
              onEdit={onEdit}
            />
          ))}
          {!tasks.length && (
            <div className="grid min-h-[90px] place-items-center rounded-[9px] border border-dashed border-[#564b74] text-[13px] text-[#a79fba]">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
