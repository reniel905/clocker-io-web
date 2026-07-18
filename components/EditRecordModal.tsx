"use client";

import { useState, type FormEvent } from "react";
import { parseISO, format } from "date-fns";
import type { TimeRecord } from "@/types";
import * as recordsApi from "@/lib/records-api";
import Button from "@/components/ui/Button";

type Props = {
  record: TimeRecord;
  onClose: () => void;
  onSaved: () => void;
};

function toDatetimeLocal(iso: string) {
  return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");
}

export default function EditRecordModal({ record, onClose, onSaved }: Props) {
  const [startTime, setStartTime] = useState(toDatetimeLocal(record.startTime));
  const [endTime, setEndTime] = useState(
    record.endTime ? toDatetimeLocal(record.endTime) : "",
  );
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!reason.trim()) {
      setError("Please provide a reason for the edit");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Invalid time values");
      return;
    }
    if (end <= start) {
      setError("End time must be after start time");
      return;
    }

    setSaving(true);
    try {
      await recordsApi.updateRecord(record._id, {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        editReason: reason.trim(),
        recordType: "custom",
      });
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update record");
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
        <h2 className="m3-title-large text-on-surface mb-4">Edit Time Record</h2>

        {error && (
          <p className="mb-4 m3-body-small text-on-error-container bg-error-container m3-shape-sm px-4 py-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              id="modal-start"
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-4 pt-5 pb-2 text-sm outline-2 outline-transparent transition-all placeholder-transparent focus:outline-primary"
              placeholder="Clock In"
            />
            <label
              htmlFor="modal-start"
              className="absolute left-4 top-3 text-xs text-primary pointer-events-none"
            >
              Clock In
            </label>
          </div>

          <div className="relative">
            <input
              id="modal-end"
              type="datetime-local"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-4 pt-5 pb-2 text-sm outline-2 outline-transparent transition-all placeholder-transparent focus:outline-primary"
              placeholder="Clock Out"
            />
            <label
              htmlFor="modal-end"
              className="absolute left-4 top-3 text-xs text-primary pointer-events-none"
            >
              Clock Out
            </label>
          </div>

          <div className="relative">
            <textarea
              id="modal-reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-4 pt-5 pb-2 text-sm outline-2 outline-transparent transition-all placeholder-transparent focus:outline-primary resize-none"
              placeholder="Reason for edit"
            />
            <label
              htmlFor="modal-reason"
              className="absolute left-4 top-3 text-xs text-primary pointer-events-none"
            >
              Reason for edit <span className="text-error">*</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="filled" disabled={saving} className="flex-1">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outlined" onClick={onClose} disabled={saving} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
