"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "filled" | "tonal" | "outlined" | "text";
  children: ReactNode;
};

export default function Button({
  variant = "filled",
  children,
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 m3-shape-full px-6 h-10 m3-label-large transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] outline-none focus-visible:outline-2 focus-visible:outline-primary";

  const variants: Record<string, string> = {
    filled:
      "bg-primary text-on-primary hover:shadow-md hover:brightness-110",
    tonal:
      "bg-secondary-container text-on-secondary-container hover:brightness-95",
    outlined:
      "border border-outline text-primary hover:bg-primary-container/30",
    text: "text-primary hover:bg-primary-container/30",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
