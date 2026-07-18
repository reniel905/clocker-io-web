"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "assist" | "filter" | "input" | "suggestion";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function Chip({
  children,
  variant = "assist",
  selected,
  onClick,
  className = "",
}: Props) {
  const base =
    "inline-flex items-center gap-1.5 m3-shape-sm px-3 h-8 m3-label-large transition-all duration-200";

  const styles: Record<string, string> = {
    assist:
      "bg-surface text-on-surface-variant border border-outline hover:bg-surface-container-high",
    filter: `${
      selected
        ? "bg-secondary-container text-on-secondary-container border border-secondary-container"
        : "bg-surface text-on-surface-variant border border-outline hover:bg-surface-container-high"
    }`,
    input: "bg-secondary-container text-on-secondary-container border border-secondary-container",
    suggestion:
      "bg-surface-container-high text-on-surface-variant border border-outline-variant hover:bg-surface-container-highest",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
