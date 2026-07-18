"use client";

import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parseISO,
  isSameDay,
} from "date-fns";
import type { TimeRecord } from "@/types";
import Card from "@/components/ui/Card";

type Props = {
  currentDate: Date;
  records: TimeRecord[];
};

function getDayTotal(day: Date, records: TimeRecord[]) {
  const dayRecords = records.filter((r) => isSameDay(parseISO(r.startTime), day));
  const totalMs = dayRecords.reduce((acc, r) => {
    const end = r.endTime ? parseISO(r.endTime) : new Date();
    return acc + (end.getTime() - parseISO(r.startTime).getTime());
  }, 0);
  return (totalMs / 3600000).toFixed(1);
}

function getDayRecords(day: Date, records: TimeRecord[]) {
  return records.filter((r) => isSameDay(parseISO(r.startTime), day));
}

export default function CalendarWeek({ currentDate, records }: Props) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="space-y-2">
      <p className="m3-label-small text-on-surface-variant">
        Week of {format(weekStart, "MMM d, yyyy")}
      </p>
      <div className="flex md:grid md:grid-cols-7 gap-2 overflow-x-auto pb-2 md:pb-0">
        {days.map((day) => {
          const dayRecs = getDayRecords(day, records);
          const total = getDayTotal(day, records);
          const isToday = isSameDay(day, new Date());

          return (
            <Card
              key={day.toISOString()}
              variant={isToday ? "filled" : "elevated"}
              className={`shrink-0 w-36 md:w-auto !p-3 ${
                isToday ? "!bg-primary-container text-on-primary-container" : ""
              }`}
            >
              <p className="m3-label-small text-on-surface-variant mb-1">{format(day, "EEE")}</p>
              <p className="m3-title-large text-on-surface">{format(day, "d")}</p>
              <p className="m3-label-medium text-primary mt-1">{total}h</p>
              {dayRecs.length > 0 && (
                <div className="mt-2 space-y-0.5">
                  {dayRecs.map((r) => (
                    <div key={r._id} className="m3-body-small text-on-surface-variant leading-tight">
                      {format(parseISO(r.startTime), "HH:mm")}
                      {r.endTime && ` - ${format(parseISO(r.endTime), "HH:mm")}`}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
