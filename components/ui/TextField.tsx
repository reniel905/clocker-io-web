"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  variant?: "filled" | "outlined";
  multiline?: boolean;
  textarea?: TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export default function TextField({
  label,
  error,
  variant = "filled",
  multiline,
  textarea,
  className = "",
  ...inputProps
}: Props) {
  const wrapper = "relative w-full";

  const inputBase =
    "peer w-full bg-transparent text-on-surface text-sm outline-none transition-all duration-200 placeholder-transparent disabled:opacity-40 disabled:cursor-not-allowed resize-none";

  const labelBase =
    "absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant transition-all duration-200 pointer-events-none z-10 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs";

  const borderColor = error
    ? "border-error"
    : "border-outline-variant focus-within:border-primary";

  const containerClass =
    variant === "filled"
      ? `rounded-t-[4px] rounded-b-none bg-surface-container-highest border-b-2 ${borderColor}`
      : `m3-shape-xs border-2 bg-surface ${borderColor}`;

  const padding = "px-4 pt-5 pb-2";

  if (multiline) {
    return (
      <div className={wrapper}>
        <div className={`${containerClass} ${padding}`}>
          <textarea
            {...textarea}
            className={`${inputBase} min-h-[80px] ${className}`}
            placeholder={label}
          />
          <label className={labelBase}>{label}</label>
        </div>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <div className={`${containerClass} ${padding}`}>
        <input
          {...inputProps}
          className={`${inputBase} ${className}`}
          placeholder={label}
        />
        <label className={labelBase}>{label}</label>
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
