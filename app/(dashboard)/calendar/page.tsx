"use client";

import { useState, useEffect, useCallback } from "react";
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
} from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import * as recordsApi from "@/lib/records-api";
import type { TimeRecord } from "@/types";
import CalendarMonth from "@/components/CalendarMonth";
import CalendarWeek from "@/components/CalendarWeek";
import CalendarDay from "@/components/CalendarDay";
import Button from "@/components/ui/Button";

type View = "day" | "week" | "month";

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<View>("month");
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    try {
      const res = await recordsApi.getRecordsByUser(user._id, 1, 200);
      setRecords(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecords();
  }, [fetchRecords, user]);

  function navigate(dir: "prev" | "next") {
    if (view === "month") {
      setCurrentDate((d) => (dir === "prev" ? subMonths(d, 1) : addMonths(d, 1)));
    } else if (view === "week") {
      setCurrentDate((d) => (dir === "prev" ? subWeeks(d, 1) : addWeeks(d, 1)));
    } else {
      setCurrentDate((d) => (dir === "prev" ? subDays(d, 1) : addDays(d, 1)));
      setSelectedDate((d) => (dir === "prev" ? subDays(d, 1) : addDays(d, 1)));
    }
  }

  function getTitle() {
    if (view === "month") return format(currentDate, "MMMM yyyy");
    if (view === "week") return `Week of ${format(currentDate, "MMM d, yyyy")}`;
    return format(selectedDate, "EEEE, MMMM d, yyyy");
  }

  function handleSelectDay(day: Date) {
    setSelectedDate(day);
    setCurrentDate(day);
    setView("day");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-outline-variant border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="m3-headline-medium text-on-surface">Calendar</h1>
        <p className="m3-body-small text-on-surface-variant">
          View your time records by day, week, or month
        </p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-surface-container-high m3-shape-full p-1">
          {(["month", "week", "day"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`m3-shape-full px-4 py-1.5 text-sm font-medium transition-colors ${
                view === v
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outlined" onClick={() => navigate("prev")} className="!h-9 !px-4">
            ← Prev
          </Button>
          <span className="m3-title-small text-on-surface min-w-40 text-center">
            {getTitle()}
          </span>
          <Button variant="outlined" onClick={() => navigate("next")} className="!h-9 !px-4">
            Next →
          </Button>
        </div>
      </div>

      {view === "month" && (
        <CalendarMonth currentDate={currentDate} records={records} onSelectDay={handleSelectDay} />
      )}
      {view === "week" && <CalendarWeek currentDate={currentDate} records={records} />}
      {view === "day" && <CalendarDay selectedDate={selectedDate} records={records} />}
    </div>
  );
}
