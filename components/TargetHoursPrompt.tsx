"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import * as usersApi from "@/lib/users-api";
import Button from "@/components/ui/Button";

export default function TargetHoursPrompt() {
  const { user, refreshUser } = useAuth();
  const [hours, setHours] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!user || user.targetHours) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    const val = parseInt(hours, 10);
    if (isNaN(val) || val <= 0) {
      setError("Please enter a valid positive number");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await usersApi.updateUser(user._id, { targetHours: val });
      if (refreshUser) await refreshUser();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        className="w-full max-w-sm m3-shape-xl bg-surface text-on-surface m3-elevation-3 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m3-title-large text-on-surface mb-1">
          Set Your Target Hours
        </h2>
        <p className="m3-body-medium text-on-surface-variant mb-5">
          Enter your target internship hours to track your progress on the
          dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              id="target-hours"
              type="number"
              required
              min={1}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="peer w-full border-2 bg-surface text-on-surface m3-shape-xs px-4 pt-5 pb-2 text-sm outline-none transition-all focus:border-primary placeholder-transparent"
              placeholder="Target Hours"
              autoFocus
            />
            <label
              htmlFor="target-hours"
              className="absolute left-4 top-3 text-xs text-primary pointer-events-none"
            >
              Target Hours
            </label>
          </div>

          {error && (
            <p className="text-xs text-error">{error}</p>
          )}

          <Button
            type="submit"
            variant="filled"
            disabled={saving}
            className="w-full"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
}
