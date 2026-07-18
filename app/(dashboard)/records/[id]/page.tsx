"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO, differenceInSeconds } from "date-fns";
import * as recordsApi from "@/lib/records-api";
import type { TimeRecord } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";

function formatDuration(start: string, end?: string) {
  const s = parseISO(start);
  const e = end ? parseISO(end) : new Date();
  const secs = differenceInSeconds(e, s);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const sLeft = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sLeft).padStart(2, "0")}`;
}

export default function RecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [record, setRecord] = useState<TimeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await recordsApi.getRecord(id);
        setRecord(res.record);
      } catch {
        setError("Record not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-outline-variant border-t-primary" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="space-y-4">
        <Button variant="tonal" onClick={() => router.push("/records")}>
          ← Back to Records
        </Button>
        <Card variant="elevated" className="!p-12 text-center">
          <p className="text-on-surface-variant m3-body-medium">
            {error || "Record not found"}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="tonal" onClick={() => router.push("/records")}>
        ← Back to Records
      </Button>

      <Card variant="elevated" className="!p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="m3-headline-small text-on-surface">Record Details</h1>
          <div className="flex gap-2">
            <Chip
              variant="suggestion"
              className={
                record.recordType === "custom"
                  ? "!bg-tertiary-container !text-on-tertiary-container"
                  : ""
              }
            >
              {record.recordType === "custom" ? "Manual" : "Auto"}
            </Chip>
            <Chip
              variant="suggestion"
              className={
                record.isActive
                  ? "!bg-primary-container !text-on-primary-container"
                  : ""
              }
            >
              {record.isActive ? "Active" : "Completed"}
            </Chip>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="m3-label-small text-on-surface-variant uppercase mb-1">
              Date
            </p>
            <p className="m3-body-large text-on-surface">
              {format(parseISO(record.startTime), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="m3-label-small text-on-surface-variant uppercase mb-1">
              Duration
            </p>
            <p className="m3-body-large text-on-surface font-mono">
              {formatDuration(record.startTime, record.endTime)}
            </p>
          </div>
          <div>
            <p className="m3-label-small text-on-surface-variant uppercase mb-1">
              Clock In
            </p>
            <p className="m3-body-large text-on-surface">
              {format(parseISO(record.startTime), "hh:mm:ss a")}
            </p>
          </div>
          <div>
            <p className="m3-label-small text-on-surface-variant uppercase mb-1">
              Clock Out
            </p>
            <p className="m3-body-large text-on-surface">
              {record.endTime
                ? format(parseISO(record.endTime), "hh:mm:ss a")
                : "—"}
            </p>
          </div>
        </div>

        {record.editReason && (
          <div className="border-t border-outline-variant/40 pt-4 space-y-4">
            <div>
              <p className="m3-label-small text-on-surface-variant uppercase mb-1">
                Reason for edit
              </p>
              <p className="m3-body-medium text-on-surface">
                {record.editReason}
              </p>
            </div>
            {record.updatedAt && (
              <div>
                <p className="m3-label-small text-on-surface-variant uppercase mb-1">
                  Edited on
                </p>
                <p className="m3-body-medium text-on-surface">
                  {format(parseISO(record.updatedAt), "MMMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
