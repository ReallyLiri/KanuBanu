import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { Dispatch, SetStateAction } from "react";
import { db } from "../firebase";
import type { ColumnId, Tag, Task } from "../types/kanban";
import { randomTagColor } from "./tags";

type BoardActionOptions = {
  userId?: string;
  tasksByColumn: Record<ColumnId, Task[]>;
  setTags: Dispatch<SetStateAction<Tag[]>>;
};

export function createBoardActions({
  userId,
  tasksByColumn,
  setTags,
}: BoardActionOptions) {
  return {
    addTask: async (text: string, tagId: string, dueDate: string) => {
      if (userId)
        await createTask(
          userId,
          text,
          tagId,
          dueDate,
          tasksByColumn.todo.length,
        );
    },
    addTag: async (name: string) => {
      if (userId) await createTag(userId, name);
    },
    saveTag: async (tag: Tag) => {
      if (!userId || !tag.name.trim()) return;
      setTags((current) =>
        current.map((item) => (item.id === tag.id ? tag : item)),
      );
      await updateTag(userId, tag);
    },
    removeTag: async (tag: Tag) => {
      if (!userId) return;
      if (
        Object.values(tasksByColumn).some((tasks) =>
          tasks.some((task) => task.tagId === tag.id),
        )
      )
        return;
      setTags((current) => current.filter((item) => item.id !== tag.id));
      await deleteTag(userId, tag.id);
    },
    markTaskComplete: async (task: Task) => {
      if (userId) await completeTask(userId, task);
    },
    saveTask: async (
      task: Task,
      text: string,
      tagId: string,
      dueDate: string,
    ) => {
      if (userId) await updateTask(userId, task.id, text, tagId, dueDate);
    },
    reorderTask: async (task: Task, destination: ColumnId, index: number) => {
      if (userId)
        await moveTask(
          userId,
          task,
          destination,
          index,
          tasksByColumn[destination],
        );
    },
  };
}

export async function createTask(
  userId: string,
  text: string,
  tagId: string,
  dueDate: string,
  order: number,
) {
  await addDoc(collection(db, "users", userId, "tasks"), {
    text: text.trim(),
    tagId: tagId || null,
    dueDate: dueDate || null,
    column: "todo",
    order,
    deleted: false,
    createdAt: serverTimestamp(),
  });
}

export async function createTag(userId: string, name: string) {
  await addDoc(collection(db, "users", userId, "tags"), {
    name: name.trim(),
    color: randomTagColor(),
    createdAt: serverTimestamp(),
  });
}

export async function updateTag(userId: string, tag: Tag) {
  await updateDoc(doc(db, "users", userId, "tags", tag.id), {
    name: tag.name.trim(),
    color: tag.color,
  });
}

export async function deleteTag(userId: string, tagId: string) {
  await deleteDoc(doc(db, "users", userId, "tags", tagId));
}

export async function completeTask(userId: string, task: Task) {
  await updateDoc(doc(db, "users", userId, "tasks", task.id), {
    deleted: true,
    deletedAt: serverTimestamp(),
  });
}

export async function updateTask(
  userId: string,
  taskId: string,
  text: string,
  tagId: string,
  dueDate: string,
) {
  await updateDoc(doc(db, "users", userId, "tasks", taskId), {
    text: text.trim(),
    tagId: tagId || null,
    dueDate: dueDate || null,
  });
}

export async function moveTask(
  userId: string,
  task: Task,
  destination: ColumnId,
  index: number,
  destinationTasks: Task[],
) {
  const ordered = destinationTasks.filter((item) => item.id !== task.id);
  ordered.splice(index, 0, { ...task, column: destination });
  await Promise.all(
    ordered.map((item, order) =>
      updateDoc(doc(db, "users", userId, "tasks", item.id), {
        column: destination,
        order,
      }),
    ),
  );
}
