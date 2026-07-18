"use client";

import { useMemo } from "react";
import type { TimeRecord } from "@/types";
import { parseISO, format, startOfDay, addDays, differenceInCalendarDays } from "date-fns";
import Card from "@/components/ui/Card";

type Props = {
  records: TimeRecord[];
  targetHours?: number;
  targetDate?: string;
  allowOverTime?: boolean;
  allowWeekEnds?: boolean;
};

const DAILY_CAP = 8;

function isWorkingDay(date: Date, allowWeekends: boolean) {
  const day = date.getDay();
  if (day === 0) return false;
  if (day === 6 && !allowWeekends) return false;
  return true;
}

export default function CompletionEstimate({
  records,
  targetHours,
  targetDate,
  allowOverTime,
  allowWeekEnds,
}: Props) {
  const estimate = useMemo(() => {
    if (!targetHours || targetHours <= 0) return null;

    const now = new Date();
    const today = startOfDay(now);

    const dailyMap = new Map<string, number>();

    for (const r of records) {
      if (!r.endTime) continue;
      const day = startOfDay(parseISO(r.startTime)).getTime();
      const key = format(day, "yyyy-MM-dd");
      const hours =
        (parseISO(r.endTime).getTime() - parseISO(r.startTime).getTime()) / 3600000;
      dailyMap.set(key, (dailyMap.get(key) || 0) + hours);
    }

    const totalCompleted = Array.from(dailyMap.values()).reduce((a, b) => a + b, 0);
    const remaining = targetHours - totalCompleted;

    if (remaining <= 0) {
      return {
        totalCompleted,
        remaining: 0,
        avgDaily: 0,
        estimatedDate: null,
        aheadBehind: null,
        done: true,
      };
    }

    const aw = !!allowWeekEnds;
    let totalCappedHours = 0;
    let eligibleDays = 0;

    for (const hours of dailyMap.values()) {
      const capped = allowOverTime ? hours : Math.min(hours, DAILY_CAP);
      totalCappedHours += capped;
      eligibleDays++;
    }

    const avgDaily = eligibleDays > 0 ? totalCappedHours / eligibleDays : 0;

    if (avgDaily <= 0) {
      return {
        totalCompleted,
        remaining,
        avgDaily: 0,
        estimatedDate: null,
        aheadBehind: null,
        done: false,
      };
    }

    let projectedRemaining = remaining;
    let cursor = addDays(today, 1);

    while (projectedRemaining > 0) {
      if (isWorkingDay(cursor, aw)) {
        const todayContribution = allowOverTime ? avgDaily : Math.min(avgDaily, DAILY_CAP);
        projectedRemaining -= todayContribution;
      }
      cursor = addDays(cursor, 1);
    }

    const estimatedDate = cursor;

    let aheadBehind: { days: number; ahead: boolean } | null = null;
    if (targetDate) {
      const target = startOfDay(new Date(targetDate));
      const diff = differenceInCalendarDays(estimatedDate, target);
      aheadBehind = { days: Math.abs(diff), ahead: diff <= 0 };
    }

    return {
      totalCompleted,
      remaining,
      avgDaily: Math.round(avgDaily * 100) / 100,
      estimatedDate,
      aheadBehind,
      done: false,
    };
  }, [records, targetHours, targetDate, allowOverTime, allowWeekEnds]);

  if (!estimate || !targetHours) return null;

  const pct = Math.min(100, Math.round((estimate.totalCompleted / targetHours) * 100));

  return (
    <Card variant="elevated" className="!p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="m3-title-medium text-on-surface">Completion Estimate</h2>
        <span className="m3-body-medium text-primary font-mono">{pct}%</span>
      </div>

      <div className="h-2 m3-shape-full bg-surface-container-highest overflow-hidden">
        <div
          className="h-full m3-shape-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="m3-label-small text-on-surface-variant uppercase">Completed</p>
          <p className="m3-body-large text-on-surface font-mono">
            {estimate.totalCompleted.toFixed(1)}h
          </p>
        </div>
        <div>
          <p className="m3-label-small text-on-surface-variant uppercase">Remaining</p>
          <p className="m3-body-large text-on-surface font-mono">
            {estimate.done ? "0h" : `${estimate.remaining.toFixed(1)}h`}
          </p>
        </div>
      </div>

      {estimate.done ? (
        <div className="flex items-center gap-2 text-tertiary m3-body-medium">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Target reached!
        </div>
      ) : (
        <>
          <div>
            <p className="m3-label-small text-on-surface-variant uppercase">Avg Daily Pace</p>
            <p className="m3-body-large text-on-surface font-mono">
              {estimate.avgDaily > 0 ? `${estimate.avgDaily.toFixed(1)}h / day` : "—"}
            </p>
          </div>

          {estimate.estimatedDate && (
            <div>
              <p className="m3-label-small text-on-surface-variant uppercase">
                Estimated Completion
              </p>
              <p className="m3-body-large text-on-surface">
                {format(estimate.estimatedDate, "MMMM d, yyyy")}
              </p>
            </div>
          )}

          {estimate.aheadBehind && (
            <div
              className={`flex items-center gap-2 m3-body-medium ${
                estimate.aheadBehind.ahead
                  ? "text-tertiary"
                  : "text-error"
              }`}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {estimate.aheadBehind.ahead ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                )}
              </svg>
              {estimate.aheadBehind.ahead
                ? `${estimate.aheadBehind.days} day${estimate.aheadBehind.days !== 1 ? "s" : ""} ahead of target`
                : `${estimate.aheadBehind.days} day${estimate.aheadBehind.days !== 1 ? "s" : ""} behind target`}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
