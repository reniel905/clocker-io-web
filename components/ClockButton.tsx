"use client";

import { useState } from "react";

type Props = {
  isActive: boolean;
  onClockIn: () => Promise<void>;
  onClockOut: () => Promise<void>;
};

export default function ClockButton({ isActive, onClockIn, onClockOut }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      if (isActive) {
        await onClockOut();
      } else {
        await onClockIn();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`relative flex h-28 w-28 items-center justify-center m3-shape-full ${
        isActive
          ? "bg-error-container text-on-error-container"
          : "bg-primary text-on-primary"
      } m3-elevation-3 hover:m3-elevation-4 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <svg className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isActive ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12v12H6z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            )}
          </svg>
          <span className="text-sm font-semibold">
            {isActive ? "Clock Out" : "Clock In"}
          </span>
        </div>
      )}
    </button>
  );
}
