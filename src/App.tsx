import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { AuthScreen } from "./components/AuthScreen";
import { AuthLoader } from "./components/AuthLoader";
import { Board } from "./components/Board";
import { CompletionDialog } from "./components/CompletionDialog";
import { TaskEditorDialog } from "./components/TaskEditorDialog";
import { TagsPanel } from "./components/TagsPanel";
import { TaskComposer } from "./components/TaskComposer";
import { auth, googleProvider } from "./firebase";
import { useBoardData } from "./hooks/useBoardData";
import { createBoardActions } from "./utils/board";
import type { Task } from "./types/kanban";
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const { tasks, tags, error, setTags, tasksByColumn } = useBoardData(user);
  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsAuthLoading(false);
      }),
    [],
  );
  const actions = createBoardActions({
    userId: user?.uid,
    tasksByColumn,
    setTags,
  });
  if (isAuthLoading) return <AuthLoader />;
  if (!user)
    return (
      <AuthScreen
        error={authError}
        onSignIn={() =>
          signInWithPopup(auth, googleProvider).catch((signInError) =>
            setAuthError(signInError.message),
          )
        }
      />
    );
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,#21113c_0,transparent_26%),#090714] bg-black font-sans text-[#f5efff]">
      <nav className="flex h-[75px] items-center justify-between border-b border-[#30264a] bg-[#100c1e]/90 px-5 backdrop-blur sm:px-[max(5vw,30px)]">
        <div className="flex items-center gap-[11px]">
          <span className="font-bold tracking-[-.03em]">KanuBanu</span>
        </div>
        <div className="flex items-center gap-[11px] text-[13px] text-[#bdb5cf]">
          <span className="hidden sm:inline">
            {user.displayName || user.email}
          </span>
          <button
            className="cursor-pointer text-[#ff9ed8] underline"
            onClick={() => signOut(auth)}
          >
            Sign out
          </button>
        </div>
      </nav>
      <div className="mx-auto w-[min(100%-32px,1100px)] py-[38px] sm:w-[min(100%-48px,1100px)] sm:py-[65px]">
        {error && <p className="mt-3.5 block text-[#ff9ed8]">{error}</p>}
        <TaskComposer tags={tags} onCreate={actions.addTask} />
        <Board
          tasks={tasks}
          tasksByColumn={tasksByColumn}
          tags={tags}
          onDone={setTaskToComplete}
          onEdit={setTaskToEdit}
          onMove={actions.reorderTask}
        />
        <TagsPanel
          tags={tags}
          tasks={tasks}
          onCreate={actions.addTag}
          onUpdate={actions.saveTag}
          onDelete={actions.removeTag}
        />
        <CompletionDialog
          task={taskToComplete}
          onCancel={() => setTaskToComplete(null)}
          onConfirm={async () => {
            if (taskToComplete) await actions.markTaskComplete(taskToComplete);
            setTaskToComplete(null);
          }}
        />
        <TaskEditorDialog
          task={taskToEdit}
          tags={tags}
          onCancel={() => setTaskToEdit(null)}
          onSave={async (text, tagId, dueDate) => {
            if (taskToEdit)
              await actions.saveTask(taskToEdit, text, tagId, dueDate);
            setTaskToEdit(null);
          }}
        />
      </div>
    </main>
  );
}
export default App;
