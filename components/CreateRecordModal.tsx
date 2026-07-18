"use client";

import { useState, type FormEvent } from "react";
import * as recordsApi from "@/lib/records-api";
import Button from "@/components/ui/Button";

type Props = {
  userId: string;
  onClose: () => void;
  onSaved: () => void;
};

export default function CreateRecordModal({
  userId,
  onClose,
  onSaved,
}: Props) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Please provide valid start and end times");
      return;
    }
    if (end <= start) {
      setError("End time must be after start time");
      return;
    }

    setSaving(true);
    try {
      await recordsApi.createRecord(userId, {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      onSaved();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create record",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="w-full max-w-md mx-4 m3-shape-xl bg-surface text-on-surface m3-elevation-3 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m3-title-large text-on-surface mb-4">
          New Time Record
        </h2>

        {error && (
          <p className="mb-4 m3-body-small text-on-error-container bg-error-container m3-shape-sm px-4 py-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              id="create-start"
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-4 pt-5 pb-2 text-sm outline-2 outline-transparent transition-all placeholder-transparent focus:outline-primary"
              placeholder="Clock In"
            />
            <label
              htmlFor="create-start"
              className="absolute left-4 top-3 text-xs text-primary pointer-events-none"
            >
              Clock In
            </label>
          </div>

          <div className="relative">
            <input
              id="create-end"
              type="datetime-local"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-4 pt-5 pb-2 text-sm outline-2 outline-transparent transition-all placeholder-transparent focus:outline-primary"
              placeholder="Clock Out"
            />
            <label
              htmlFor="create-end"
              className="absolute left-4 top-3 text-xs text-primary pointer-events-none"
            >
              Clock Out
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="filled"
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Creating..." : "Create Record"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              disabled={saving}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
