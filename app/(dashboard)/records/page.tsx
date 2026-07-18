"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import * as recordsApi from "@/lib/records-api";
import type { TimeRecord } from "@/types";
import { format, parseISO, differenceInSeconds } from "date-fns";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import TextField from "@/components/ui/TextField";
import EditRecordModal from "@/components/EditRecordModal";
import CreateRecordModal from "@/components/CreateRecordModal";
import BatchCreateModal from "@/components/BatchCreateModal";
import ConfirmDialog from "@/components/ConfirmDialog";

function formatDuration(start: string, end?: string) {
  const s = parseISO(start);
  const e = end ? parseISO(end) : new Date();
  const secs = differenceInSeconds(e, s);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const sLeft = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sLeft).padStart(2, "0")}`;
}

const PAGE_SIZE = 10;

export default function RecordsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [allRecords, setAllRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRecord, setEditingRecord] = useState<TimeRecord | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    try {
      const res = await recordsApi.getRecordsByUser(user._id, 1, 500);
      const sorted = res.data.slice().sort(
        (a, b) => parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime(),
      );
      setAllRecords(sorted);
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

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return allRecords;
    const q = searchQuery.toLowerCase();
    return allRecords.filter(
      (r) =>
        format(parseISO(r.startTime), "MMM d, yyyy").toLowerCase().includes(q) ||
        format(parseISO(r.startTime), "hh:mm a").toLowerCase().includes(q) ||
        (r.endTime && format(parseISO(r.endTime), "hh:mm a").toLowerCase().includes(q)) ||
        formatDuration(r.startTime, r.endTime).includes(q) ||
        (r.recordType === "custom" ? "manual" : "auto").includes(q) ||
        (r.isActive ? "active" : "completed").includes(q),
    );
  }, [allRecords, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const records = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  async function handleDelete() {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await recordsApi.deleteRecord(deletingId);
      setDeletingId(null);
      fetchRecords();
    } catch {
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="m3-headline-medium text-on-surface">Time Records</h1>
          <p className="m3-body-small text-on-surface-variant">
            View all your clock-in and clock-out records
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="tonal" onClick={() => router.push("/dtr")} className="w-full sm:w-auto">
            DTR
          </Button>
          <Button variant="outlined" onClick={() => setShowBatch(true)} className="w-full sm:w-auto">
            Batch
          </Button>
          <Button variant="filled" onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
            + New
          </Button>
        </div>
      </div>

      <TextField
        variant="outlined"
        label="Search"
        placeholder="Search records…"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(1);
        }}
        className="w-full"
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-outline-variant border-t-primary" />
        </div>
      ) : records.length === 0 ? (
        <Card variant="elevated" className="!p-12 text-center">
          <p className="text-on-surface-variant m3-body-medium">No records found</p>
        </Card>
      ) : (
        <>
          {/* ───── Desktop table ───── */}
          <div className="hidden md:block overflow-hidden">
            <Card variant="elevated" className="!p-0">
            <table className="min-w-full border-collapse">
              <thead className="bg-surface-container-high">
                <tr>
                  {["Date", "Clock In", "Clock Out", "Duration", "Type", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left m3-label-small text-on-surface-variant uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {records.map((record) => (
                  <tr
                    key={record._id}
                    onClick={() => router.push(`/records/${record._id}`)}
                    className="transition-colors hover:bg-surface-container-low cursor-pointer"
                  >
                    <td className="whitespace-nowrap px-4 py-3 m3-body-medium text-on-surface">
                      {format(parseISO(record.startTime), "MMM d, yyyy")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 m3-body-medium text-on-surface-variant">
                      {format(parseISO(record.startTime), "hh:mm a")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 m3-body-medium text-on-surface-variant">
                      {record.endTime
                        ? format(parseISO(record.endTime), "hh:mm a")
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 m3-body-medium font-mono text-on-surface">
                      {formatDuration(record.startTime, record.endTime)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
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
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
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
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!record.isActive && (
                          <>
                            <Button
                              variant="tonal"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRecord(record);
                              }}
                              className="!h-8 !px-3 !m3-shape-sm text-xs"
                            >
                              Edit
                            </Button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingId(record._id);
                              }}
                              className="flex h-8 w-8 items-center justify-center m3-shape-sm text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
                              title="Delete"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </Card>
          </div>

          {/* ───── Mobile card list ───── */}
          <div className="block md:hidden space-y-3">
            {records.map((record) => (
              <Card
                key={record._id}
                variant="elevated"
                className="space-y-3 cursor-pointer"
                onClick={() => router.push(`/records/${record._id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="m3-body-medium text-on-surface font-medium">
                      {format(parseISO(record.startTime), "MMM d, yyyy")}
                    </p>
                    <p className="m3-body-small text-on-surface-variant mt-0.5">
                      {format(parseISO(record.startTime), "hh:mm a")}
                      {record.endTime
                        ? <> → {format(parseISO(record.endTime), "hh:mm a")}</>
                        : null}
                    </p>
                  </div>

                  {!record.isActive && (
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuRowId(
                            menuRowId === record._id ? null : record._id,
                          );
                        }}
                        className="flex h-9 w-9 items-center justify-center m3-shape-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
                        aria-label="More options"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="5" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>

                      {menuRowId === record._id && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setMenuRowId(null)}
                          />
                          <div className="absolute right-0 top-full z-40 mt-1 w-40 m3-shape-xl bg-surface text-on-surface m3-elevation-3 py-2">
                            <button
                              onClick={() => {
                                setEditingRecord(record);
                                setMenuRowId(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-high transition-colors text-left"
                            >
                              <svg
                                className="h-4 w-4 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setDeletingId(record._id);
                                setMenuRowId(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-error-container transition-colors text-left"
                            >
                              <svg
                                className="h-4 w-4 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="m3-body-small font-mono text-on-surface">
                    {formatDuration(record.startTime, record.endTime)}
                  </p>
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
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
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
              </Card>
            ))}
          </div>

          {/* ───── Pagination ───── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outlined"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="!h-9 !px-4"
              >
                Previous
              </Button>
              <span className="m3-body-small text-on-surface-variant">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outlined"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="!h-9 !px-4"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {editingRecord && (
        <EditRecordModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSaved={() => {
            setEditingRecord(null);
            fetchRecords();
          }}
        />
      )}

      {showCreate && user && (
        <CreateRecordModal
          userId={user._id}
          onClose={() => setShowCreate(false)}
          onSaved={() => {
            setShowCreate(false);
            fetchRecords();
          }}
        />
      )}

      {showBatch && user && (
        <BatchCreateModal
          userId={user._id}
          onClose={() => setShowBatch(false)}
          onSaved={() => {
            setShowBatch(false);
            fetchRecords();
          }}
        />
      )}

      <ConfirmDialog
        open={!!deletingId}
        title="Delete record?"
        message="This action cannot be undone. The record will be permanently removed."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
