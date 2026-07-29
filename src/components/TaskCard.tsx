import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Tag, Task } from "../types/kanban";
import { formatDueDate } from "../utils/tasks";

type TaskCardProps = {
  task: Task;
  tag?: Tag;
  onDone?: (task: Task) => void;
  onEdit?: (task: Task) => void;
};

export function TaskCard({ task, tag, onDone, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "task", task } });
  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-2 rounded-[9px] border border-[#41385d] bg-[#211a33] px-[11px] pt-[14px] pb-[13px] text-[#f5efff] shadow-[0_2px_10px_#09071480] ${isDragging ? "opacity-35" : ""}`}
      {...attributes}
    >
      <button
        className="cursor-pointer touch-none bg-transparent px-0.5 py-px text-[18px] leading-none text-[#8f86aa]"
        aria-label="Drag task"
        {...listeners}
      >
        ⠿
      </button>
      <TaskDetails task={task} tag={tag} />
      {onEdit && (
        <button
          className="cursor-pointer bg-transparent px-0.5 text-sm text-[#a79fba] hover:text-[#7df9ff]"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.text}`}
        >
          ✎
        </button>
      )}
      {onDone && (
        <button
          className="size-[22px] cursor-pointer rounded-full border border-[#685c87] bg-[#171126] text-[13px] text-[#a79fba] hover:border-[#a7ff83] hover:bg-[#233323] hover:text-[#a7ff83]"
          onClick={() => onDone(task)}
          aria-label={`Mark ${task.text} done`}
        >
          ✓
        </button>
      )}
    </article>
  );
}

export function TaskPreview({ task, tag }: Omit<TaskCardProps, "onDone">) {
  return (
    <article className="flex items-start gap-2 rounded-[9px] border border-[#41385d] bg-[#211a33] px-[11px] pt-[14px] pb-[13px] text-[#f5efff] shadow-[0_2px_10px_#09071480]">
      <span className="px-0.5 py-px text-[18px] leading-none text-[#8f86aa]">
        ⠿
      </span>
      <TaskDetails task={task} tag={tag} />
    </article>
  );
}

function TaskDetails({ task, tag }: Omit<TaskCardProps, "onDone">) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-2.5 text-sm leading-[1.35]">{task.text}</p>
      <div className="flex flex-wrap items-center gap-2">
        {tag && (
          <span
            className="rounded px-[7px] py-[3px] text-[10px] leading-none font-extrabold text-[#090714]"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </span>
        )}
        {task.dueDate && (
          <span className="text-[11px] text-[#a79fba]">
            ◷ {formatDueDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
