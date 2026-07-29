export type ColumnId = "todo" | "inprog";

export type Task = {
  id: string;
  text: string;
  tagId?: string;
  dueDate?: string;
  column: ColumnId;
  order: number;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type BoardColumn = { id: ColumnId; name: string; accent: string };

export const columns: BoardColumn[] = [
  { id: "todo", name: "TODO", accent: "#ff9ed8" },
  { id: "inprog", name: "INPROG", accent: "#7df9ff" },
];
