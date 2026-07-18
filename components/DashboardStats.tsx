"use client";

import { useState } from "react";
import type { TimeRecord } from "@/types";
import { startOfWeek, endOfWeek, startOfDay, endOfDay, parseISO, isWithinInterval } from "date-fns";
import Card from "@/components/ui/Card";

type Props = {
  records: TimeRecord[];
  targetHours?: number;
  totalHours: number;
};

function msToHours(ms: number) {
  return (ms / 3600000).toFixed(1);
}

export default function DashboardStats({ records, targetHours, totalHours }: Props) {
  const [copied, setCopied] = useState(false);
  const now = new Date();

  const todayRecords = records.filter((r) => {
    const start = parseISO(r.startTime);
    return isWithinInterval(start, { start: startOfDay(now), end: endOfDay(now) });
  });

  const weekRecords = records.filter((r) => {
    const start = parseISO(r.startTime);
    return isWithinInterval(start, { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) });
  });

  const todayMs = todayRecords.reduce((acc, r) => {
    if (r.endTime) return acc + (parseISO(r.endTime).getTime() - parseISO(r.startTime).getTime());
    return acc + (now.getTime() - parseISO(r.startTime).getTime());
  }, 0);

  const weekMs = weekRecords.reduce((acc, r) => {
    if (r.endTime) return acc + (parseISO(r.endTime).getTime() - parseISO(r.startTime).getTime());
    return acc + (now.getTime() - parseISO(r.startTime).getTime());
  }, 0);

  const pct = targetHours && targetHours > 0 ? Math.min(100, Math.round((totalHours / targetHours) * 100)) : 0;

  const completed = msToHours(totalHours * 3600000);

  function handleShare() {
    let dtrSettings: { companyName?: string; position?: string } = {};
    try {
      const raw = localStorage.getItem("clockerDtrSettings");
      if (raw) dtrSettings = JSON.parse(raw);
    } catch {}

    const parts = [`I've completed ${completed} of ${targetHours}h (${pct}%)`];
    if (dtrSettings.companyName) {
      const pos = dtrSettings.position ? ` (${dtrSettings.position})` : "";
      parts.push(`at ${dtrSettings.companyName}${pos}`);
    }
    parts.push("— Clocker-io");
    const text = parts.join(" ");

    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {});
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card variant="elevated">
          <p className="m3-label-small text-on-surface-variant uppercase">Today</p>
          <p className="mt-1 m3-headline-medium text-primary">{msToHours(todayMs)}h</p>
        </Card>
        <Card variant="elevated">
          <p className="m3-label-small text-on-surface-variant uppercase">This Week</p>
          <p className="mt-1 m3-headline-medium text-primary">{msToHours(weekMs)}h</p>
        </Card>
      </div>

      {targetHours && targetHours > 0 && (
        <Card variant="elevated" className="!bg-primary-container !text-on-primary-container">
          <p className="m3-label-small text-on-primary-container uppercase mb-4 text-center">
            Overall Progress
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-6">
            <div className="relative shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="var(--color-primary, #6750a4)"
                  strokeWidth="8"
                  className="opacity-30"
                />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="var(--color-on-primary-container, #1e192b)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={326.73}
                  strokeDashoffset={326.73 * (1 - pct / 100)}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="m3-headline-small text-on-primary-container font-mono">{pct}%</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="m3-body-medium text-on-primary-container font-mono">
                {completed} / {targetHours}h
              </p>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 m3-shape-full px-3 h-8 text-xs font-medium text-on-primary-container hover:bg-primary/10 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
