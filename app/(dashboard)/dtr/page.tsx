"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import * as recordsApi from "@/lib/records-api";
import { parseISO } from "date-fns";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import TextField from "@/components/ui/TextField";
import DtrDocument from "@/components/DtrDocument";

const LS_KEY = "clockerDtrSettings";

const PAPER_SIZES = [
  { value: "A4", label: "A4" },
  { value: "letter", label: "Letter" },
  { value: "legal", label: "Legal" },
] as const;

type DtrSettings = {
  companyName: string;
  position: string;
  department: string;
  paperSize: string;
  regularStart: string;
  regularEnd: string;
  saturdayStart: string;
  saturdayEnd: string;
};

const DEFAULT_SETTINGS: DtrSettings = {
  companyName: "",
  position: "",
  department: "",
  paperSize: "A4",
  regularStart: "8:00",
  regularEnd: "17:00",
  saturdayStart: "8:00",
  saturdayEnd: "13:00",
};

function loadSettings(): DtrSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveSettings(s: DtrSettings) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {}
}

export default function DtrPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [settings, setSettings] = useState<DtrSettings>(DEFAULT_SETTINGS);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [allRecords, setAllRecords] = useState<Awaited<ReturnType<typeof recordsApi.getRecordsByUser>>["data"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await recordsApi.getRecordsByUser(user._id, 1, 500);
      setAllRecords(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchRecords();
  }, [fetchRecords, user]);

  const [yearStr, monthStr] = selectedMonth.split("-");
  const monthNum = parseInt(monthStr, 10);
  const yearNum = parseInt(yearStr, 10);
  const monthName = new Date(yearNum, monthNum - 1).toLocaleString("default", { month: "long" });

  const monthRecords = allRecords.filter((r) => {
    const d = parseISO(r.startTime);
    return d.getMonth() === monthNum - 1 && d.getFullYear() === yearNum;
  });

  const employeeName = user
    ? `${user.name.lastName}, ${user.name.firstName}${user.name.middleName ? " " + user.name.middleName : ""}`
    : "";

  function updateSetting(key: keyof DtrSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="m3-headline-medium text-on-surface">Daily Time Record</h1>
          <p className="m3-body-small text-on-surface-variant">
            Generate and print your DTR for the selected month
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outlined"
            onClick={() => router.push("/records")}
            className="w-full sm:w-auto"
          >
            Back to Records
          </Button>
          <Button
            variant="filled"
            onClick={() => window.print()}
            className="w-full sm:w-auto"
          >
            Print / Download PDF
          </Button>
        </div>
      </div>

      <Card variant="filled" className="space-y-4 !p-4 sm:!p-5">
        <h2 className="m3-title-small text-on-surface">Employee &amp; Company Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField
            label="Company Name"
            value={settings.companyName}
            onChange={(e) => updateSetting("companyName", e.target.value)}
          />
          <TextField
            label="Position"
            value={settings.position}
            onChange={(e) => updateSetting("position", e.target.value)}
          />
          <TextField
            label="Department"
            value={settings.department}
            onChange={(e) => updateSetting("department", e.target.value)}
          />
          <TextField
            label="Month"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <div className="relative">
            <select
              id="dtr-paper"
              value={settings.paperSize}
              onChange={(e) => updateSetting("paperSize", e.target.value)}
              className="peer w-full border-2 bg-surface text-on-surface m3-shape-xs px-4 pt-5 pb-2 text-sm outline-none transition-all focus:border-primary appearance-none"
            >
              {PAPER_SIZES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <label
              htmlFor="dtr-paper"
              className="absolute left-4 top-3 text-xs text-primary pointer-events-none"
            >
              Paper Size
            </label>
          </div>
        </div>

        <h2 className="m3-title-small text-on-surface pt-2">Prescribed Office Hours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextField
            label="Regular Start"
            type="time"
            value={settings.regularStart}
            onChange={(e) => updateSetting("regularStart", e.target.value)}
          />
          <TextField
            label="Regular End"
            type="time"
            value={settings.regularEnd}
            onChange={(e) => updateSetting("regularEnd", e.target.value)}
          />
          <TextField
            label="Saturday Start"
            type="time"
            value={settings.saturdayStart}
            onChange={(e) => updateSetting("saturdayStart", e.target.value)}
          />
          <TextField
            label="Saturday End"
            type="time"
            value={settings.saturdayEnd}
            onChange={(e) => updateSetting("saturdayEnd", e.target.value)}
          />
        </div>
      </Card>

      <div className="dtr-print-area overflow-auto bg-white border border-outline-variant m3-shape-xl print:border-none print:shadow-none">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-outline-variant border-t-primary" />
          </div>
        ) : (
          <div className="min-w-[900px] p-4 print:p-0">
            <DtrDocument
              companyName={settings.companyName}
              employeeName={employeeName}
              position={settings.position}
              department={settings.department}
              month={monthName}
              year={yearNum}
              regularStart={settings.regularStart}
              regularEnd={settings.regularEnd}
              saturdayStart={settings.saturdayStart}
              saturdayEnd={settings.saturdayEnd}
              records={monthRecords}
            />
          </div>
        )}
      </div>

      <style>{`
        @page { size: ${settings.paperSize} portrait; margin: 0; }
      `}</style>
      <style jsx global>{`
        @media print {
          header, nav {
            display: none !important;
          }
          main {
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .space-y-4 > :not(.dtr-print-area) {
            display: none !important;
          }
          .dtr-print-area {
            padding: 1in !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
          }

        }
      `}</style>
    </div>
  );
}
