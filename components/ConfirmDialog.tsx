"use client";

import Button from "@/components/ui/Button";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="w-full max-w-sm mx-4 m3-shape-xl bg-surface text-on-surface m3-elevation-3 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m3-title-large text-on-surface mb-2">{title}</h2>
        <p className="m3-body-medium text-on-surface-variant mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="filled" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
