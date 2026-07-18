"use client";

import { useState } from "react";
import * as recordsApi from "@/lib/records-api";
import Button from "@/components/ui/Button";

type Row = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
};

type Props = {
  userId: string;
  onClose: () => void;
  onSaved: () => void;
};

let nextId = 1;

export default function BatchCreateModal({ userId, onClose, onSaved }: Props) {
  const [rows, setRows] = useState<Row[]>([
    { id: nextId++, date: "", startTime: "", endTime: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successCount, setSuccessCount] = useState<number | null>(null);

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: nextId++, date: "", startTime: "", endTime: "" },
    ]);
  }

  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRow(id: number, field: keyof Row, value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  async function handleSubmit() {
    setError("");

    const validRows = rows.filter((r) => r.date && r.startTime && r.endTime);

    if (validRows.length === 0) {
      setError("Please fill in at least one complete row");
      return;
    }

    for (const row of validRows) {
      const start = new Date(`${row.date}T${row.startTime}`);
      const end = new Date(`${row.date}T${row.endTime}`);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setError(`Row #${row.id}: Invalid date or time`);
        return;
      }
      if (end <= start) {
        setError(`Row #${row.id}: End time must be after start time`);
        return;
      }
    }

    const records = validRows.map((r) => ({
      userId,
      startTime: new Date(`${r.date}T${r.startTime}`).toISOString(),
      endTime: new Date(`${r.date}T${r.endTime}`).toISOString(),
      recordType: "custom" as const,
    }));

    setSaving(true);
    try {
      await recordsApi.createBatchRecords(userId, records);
      setSuccessCount(records.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create records");
    } finally {
      setSaving(false);
    }
  }

  if (successCount !== null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div
          className="w-full max-w-md mx-4 m3-shape-xl bg-surface text-on-surface m3-elevation-3 p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-4xl mb-3 text-primary">&#10003;</div>
          <h2 className="m3-title-large text-on-surface mb-2">
            Records Created
          </h2>
          <p className="m3-body-medium text-on-surface-variant mb-6">
            Successfully imported {successCount} time record
            {successCount !== 1 ? "s" : ""}.
          </p>
          <Button
            variant="filled"
            onClick={() => {
              onSaved();
            }}
            className="w-full"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 overflow-y-auto py-8">
      <div
        className="w-full max-w-2xl mx-4 m3-shape-xl bg-surface text-on-surface m3-elevation-3 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m3-title-large text-on-surface mb-1">
          Batch Import Time Records
        </h2>
        <p className="m3-body-small text-on-surface-variant mb-4">
          Add multiple time records at once for past work hours.
        </p>

        {error && (
          <p className="mb-4 m3-body-small text-on-error-container bg-error-container m3-shape-sm px-4 py-3">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_1fr_40px] gap-2 px-1">
            <span className="m3-label-small text-on-surface-variant uppercase">
              Date
            </span>
            <span className="m3-label-small text-on-surface-variant uppercase">
              Clock In
            </span>
            <span className="m3-label-small text-on-surface-variant uppercase">
              Clock Out
            </span>
            <span />
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_40px] gap-2 items-end"
            >
              <div className="relative">
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => updateRow(row.id, "date", e.target.value)}
                  className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-3 pt-4 pb-1.5 text-sm outline-2 outline-transparent transition-all focus:outline-primary"
                  placeholder="Date"
                />
                <label className="absolute left-3 top-1 text-[10px] text-primary pointer-events-none">
                  Date
                </label>
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={row.startTime}
                  onChange={(e) =>
                    updateRow(row.id, "startTime", e.target.value)
                  }
                  className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-3 pt-4 pb-1.5 text-sm outline-2 outline-transparent transition-all focus:outline-primary"
                  placeholder="Start"
                />
                <label className="absolute left-3 top-1 text-[10px] text-primary pointer-events-none">
                  Clock In
                </label>
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={row.endTime}
                  onChange={(e) =>
                    updateRow(row.id, "endTime", e.target.value)
                  }
                  className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-3 pt-4 pb-1.5 text-sm outline-2 outline-transparent transition-all focus:outline-primary"
                  placeholder="End"
                />
                <label className="absolute left-3 top-1 text-[10px] text-primary pointer-events-none">
                  Clock Out
                </label>
              </div>
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={rows.length <= 1}
                className="flex h-10 w-10 items-center justify-center m3-shape-sm text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors disabled:opacity-20 disabled:cursor-not-allowed mt-1 sm:mt-0"
                title="Remove row"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <Button
          variant="tonal"
          onClick={addRow}
          className="mt-3 w-full"
        >
          + Add Row
        </Button>

        <div className="flex gap-3 pt-5">
          <Button
            variant="filled"
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1"
          >
            {saving ? "Importing..." : `Import ${rows.filter((r) => r.date && r.startTime && r.endTime).length} Record${rows.filter((r) => r.date && r.startTime && r.endTime).length !== 1 ? "s" : ""}`}
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={saving}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
