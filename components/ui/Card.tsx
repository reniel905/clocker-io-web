"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "elevated" | "filled" | "outlined";
  className?: string;
  onClick?: () => void;
};

export default function Card({
  children,
  variant = "elevated",
  className = "",
  onClick,
}: Props) {
  const styles: Record<string, string> = {
    elevated: "bg-surface-container-low m3-elevation-1 hover:m3-elevation-2",
    filled: "bg-surface-container-highest",
    outlined: "bg-surface border border-outline-variant",
  };

  return (
    <div
      onClick={onClick}
      className={`m3-shape-md text-on-surface p-4 transition-shadow ${styles[variant]} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
