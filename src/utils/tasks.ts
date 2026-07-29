import type { ColumnId, Task } from "../types/kanban";

export function groupTasksByColumn(tasks: Task[]) {
  return {
    todo: sortedTasks(tasks, "todo"),
    inprog: sortedTasks(tasks, "inprog"),
  };
}

export function formatDueDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function sortedTasks(tasks: Task[], column: ColumnId) {
  return tasks
    .filter((task) => task.column === column)
    .sort((first, second) => first.order - second.order);
}
