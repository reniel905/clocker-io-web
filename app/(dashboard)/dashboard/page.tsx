"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import * as recordsApi from "@/lib/records-api";
import type { TimeRecord } from "@/types";
import ClockButton from "@/components/ClockButton";
import ElapsedTimer from "@/components/ElapsedTimer";
import DashboardStats from "@/components/DashboardStats";
import Card from "@/components/ui/Card";

export default function DashboardPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<TimeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    try {
      const res = await recordsApi.getRecordsByUser(user._id, 1, 100);
      setRecords(res.data);
      setActiveRecord(res.data.find((r) => r.isActive) || null);
    } catch {
      setError("Failed to load records");
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

  async function handleClockIn() {
    if (!user) return;
    setError("");
    try {
      await recordsApi.clockIn(user._id);
      await fetchRecords();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Clock-in failed");
    }
  }

  async function handleClockOut() {
    if (!activeRecord) return;
    setError("");
    try {
      await recordsApi.clockOut(activeRecord._id);
      await fetchRecords();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Clock-out failed");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-outline-variant border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="m3-headline-medium text-on-surface">Dashboard</h1>
        <p className="m3-body-small text-on-surface-variant">
          {user?.name.firstName} {user?.name.lastName}
        </p>
      </div>

      {error && (
        <p className="m3-body-small text-on-error-container bg-error-container m3-shape-sm px-4 py-3">
          {error}
        </p>
      )}

      <DashboardStats records={records} />

      <Card variant="elevated" className="flex flex-col items-center gap-6 !py-8">
        {activeRecord ? (
          <>
            <p className="m3-body-medium text-on-surface-variant">
              Clocked in since{" "}
              {new Date(activeRecord.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <ElapsedTimer startTime={activeRecord.startTime} />
          </>
        ) : (
          <p className="m3-body-medium text-on-surface-variant">
            You are not clocked in
          </p>
        )}

        <ClockButton
          isActive={!!activeRecord}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
        />
      </Card>
    </div>
  );
}
