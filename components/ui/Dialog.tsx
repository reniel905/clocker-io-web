"use client";

import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Dialog({ open, onClose, title, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => onClose()}>
      <div
        className="w-full max-w-md mx-4 m3-shape-xl bg-surface text-on-surface m3-elevation-3 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="m3-title-large mb-4 text-on-surface">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
