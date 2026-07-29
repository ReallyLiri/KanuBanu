import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { BoardColumn } from "./BoardColumn";
import { TaskPreview } from "./TaskCard";
import { columns, type ColumnId, type Tag, type Task } from "../types/kanban";

type BoardProps = {
  tasksByColumn: Record<ColumnId, Task[]>;
  tasks: Task[];
  tags: Tag[];
  onDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onMove: (task: Task, destination: ColumnId, index: number) => Promise<void>;
};

export function Board({
  tasksByColumn,
  tasks,
  tags,
  onDone,
  onEdit,
  onMove,
}: BoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function dragStart(event: DragStartEvent) {
    setActiveTask(event.active.data.current?.task as Task);
  }

  function dragEnd(event: DragEndEvent) {
    setActiveTask(null);
    if (!event.over) return;
    const moving = tasks.find((task) => task.id === event.active.id);
    if (!moving) return;
    const targetTask = tasks.find((task) => task.id === event.over?.id);
    const destination = targetTask?.column || (event.over.id as ColumnId);
    if (!columns.some((column) => column.id === destination)) return;
    const targetList = tasksByColumn[destination].filter(
      (task) => task.id !== moving.id,
    );
    const index = targetTask
      ? targetList.findIndex((task) => task.id === targetTask.id)
      : targetList.length;
    onMove(moving, destination, index);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[30px]">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={tasksByColumn[column.id]}
            tags={tags}
            onDone={onDone}
            onEdit={onEdit}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="w-[min(330px,calc(100vw-32px))] rotate-2 shadow-[0_16px_28px_#1b243438] sm:w-[350px]">
            <TaskPreview
              task={activeTask}
              tag={tags.find((tag) => tag.id === activeTask.tagId)}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
