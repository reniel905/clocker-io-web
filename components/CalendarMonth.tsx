"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  isSameMonth,
} from "date-fns";
import type { TimeRecord } from "@/types";
import Card from "@/components/ui/Card";

type Props = {
  currentDate: Date;
  records: TimeRecord[];
  onSelectDay: (day: Date) => void;
};

export default function CalendarMonth({ currentDate, records, onSelectDay }: Props) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function hasRecord(day: Date) {
    return records.some((r) => isSameDay(parseISO(r.startTime), day));
  }

  function getDayTotal(day: Date) {
    const dayRecords = records.filter((r) => isSameDay(parseISO(r.startTime), day));
    const totalMs = dayRecords.reduce((acc, r) => {
      const end = r.endTime ? parseISO(r.endTime) : new Date();
      return acc + (end.getTime() - parseISO(r.startTime).getTime());
    }, 0);
    return (totalMs / 3600000).toFixed(1);
  }

  return (
    <Card variant="elevated" className="!p-0 overflow-hidden">
      <div className="grid grid-cols-7 bg-surface-container-high">
        {dayNames.map((name) => (
          <div
            key={name}
            className="px-2 py-2.5 text-center m3-label-small text-on-surface-variant uppercase"
          >
            {name}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const hasRec = hasRecord(day);
          const total = getDayTotal(day);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDay(day)}
              className={`relative flex flex-col items-center px-1 py-2.5 border-b border-r border-outline-variant/30 transition-colors
                ${isCurrentMonth ? "bg-surface" : "bg-surface-container-low"}
                ${isToday ? "bg-primary-container" : ""}
                hover:bg-surface-container-high`}
            >
              <span
                className={`m3-body-small ${
                  isCurrentMonth ? "text-on-surface" : "text-on-surface-variant/50"
                }`}
              >
                {format(day, "d")}
              </span>
              {hasRec && (
                <span className="mt-0.5 h-1 w-1 m3-shape-full bg-primary" />
              )}
              {hasRec && (
                <span className="text-[10px] text-primary font-medium mt-0.5">
                  {total}h
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
