import type { Task } from "../types/kanban";

type CompletionDialogProps = {
  task: Task | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export function CompletionDialog({
  task,
  onCancel,
  onConfirm,
}: CompletionDialogProps) {
  if (!task) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#090714]/75 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      <div className="w-full max-w-[410px] rounded-2xl border border-[#5a4a7c] bg-[#171126] p-6 text-[#f5efff] shadow-[0_0_45px_#b8a1ff40]">
        <div className="mb-5 grid size-11 place-items-center rounded-full bg-[#a7ff83]/15 text-xl text-[#a7ff83] shadow-[0_0_22px_#a7ff8340]">
          ✓
        </div>
        <p className="mb-2 text-[11px] font-extrabold tracking-[.15em] text-[#a7ff83]">
          COMPLETE TASK
        </p>
        <h2
          id="completion-title"
          className="mb-3 text-2xl font-bold tracking-[-.04em]"
        >
          Mark this task done?
        </h2>
        <p className="mb-6 leading-relaxed text-[#bdb5cf]">
          <span className="font-semibold text-[#f5efff]">{task.text}</span> will
          be removed from your active board.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-bold text-[#bdb5cf] hover:bg-[#28203d]"
            onClick={onCancel}
          >
            Keep task
          </button>
          <button
            className="cursor-pointer rounded-lg bg-[#a7ff83] px-4 py-2.5 text-sm font-bold text-[#090714] shadow-[0_0_18px_#a7ff8380] hover:bg-[#c6ffae]"
            onClick={onConfirm}
          >
            Mark complete
          </button>
        </div>
      </div>
    </div>
  );
}
