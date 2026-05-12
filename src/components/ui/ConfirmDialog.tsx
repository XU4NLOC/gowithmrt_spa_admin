"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title = "Are you sure?", message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
        <h3 className="text-lg font-semibold text-dark dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-md border px-3 py-2 text-sm">{cancelText}</button>
          <button onClick={onConfirm} className="rounded-md bg-primary px-3 py-2 text-sm text-white">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}


