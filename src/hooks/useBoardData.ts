import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../firebase";
import type { Tag, Task } from "../types/kanban";
import { groupTasksByColumn } from "../utils/tasks";

export function useBoardData(user: User | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const stopTasks = onSnapshot(
      query(
        collection(db, "users", user.uid, "tasks"),
        where("deleted", "==", false),
        orderBy("order"),
      ),
      (snapshot) => {
        setTasks(
          snapshot.docs.map(
            (item) => ({ id: item.id, ...item.data() }) as Task,
          ),
        );
      },
      (snapshotError) => setError(snapshotError.message),
    );
    const stopTags = onSnapshot(
      query(collection(db, "users", user.uid, "tags"), orderBy("name")),
      (snapshot) => {
        setTags(
          snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Tag),
        );
      },
      (snapshotError) => setError(snapshotError.message),
    );
    return () => {
      stopTasks();
      stopTags();
    };
  }, [user]);

  return {
    tasks,
    tags,
    error,
    setTags,
    tasksByColumn: useMemo(() => groupTasksByColumn(tasks), [tasks]),
  };
}
