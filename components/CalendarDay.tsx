"use client";

import { format, parseISO, isSameDay, differenceInSeconds } from "date-fns";
import type { TimeRecord } from "@/types";
import Card from "@/components/ui/Card";

type Props = {
  selectedDate: Date;
  records: TimeRecord[];
};

function formatDuration(start: string, end?: string) {
  const s = parseISO(start);
  const e = end ? parseISO(end) : new Date();
  const secs = differenceInSeconds(e, s);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const sLeft = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sLeft).padStart(2, "0")}`;
}

export default function CalendarDay({ selectedDate, records }: Props) {
  const dayRecords = records.filter((r) => isSameDay(parseISO(r.startTime), selectedDate));

  const totalMs = dayRecords.reduce((acc, r) => {
    const end = r.endTime ? parseISO(r.endTime) : new Date();
    return acc + (end.getTime() - parseISO(r.startTime).getTime());
  }, 0);

  return (
    <Card variant="elevated">
      <div className="flex items-center justify-between mb-4">
        <h3 className="m3-title-medium text-on-surface">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h3>
        <span className="m3-label-large text-primary font-mono">
          {(totalMs / 3600000).toFixed(1)}h
        </span>
      </div>

      {dayRecords.length === 0 ? (
        <p className="m3-body-medium text-on-surface-variant text-center py-6">
          No records for this day
        </p>
      ) : (
        <div className="space-y-2">
          {dayRecords.map((r) => (
            <div
              key={r._id}
              className="flex items-center justify-between m3-shape-sm bg-surface-container-low px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="m3-body-medium text-on-surface">
                  {format(parseISO(r.startTime), "hh:mm a")}
                </span>
                <span className="text-on-surface-variant">→</span>
                <span className="m3-body-medium text-on-surface">
                  {r.endTime ? format(parseISO(r.endTime), "hh:mm a") : "Ongoing"}
                </span>
              </div>
              <span className="m3-body-medium font-mono text-on-surface-variant">
                {formatDuration(r.startTime, r.endTime)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
