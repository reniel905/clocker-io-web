"use client";

import { useMemo, useState } from "react";
import type { TimeRecord } from "@/types";
import { parseISO, format, startOfDay } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "@/components/ui/Card";

type Props = {
  records: TimeRecord[];
  targetHours?: number;
};

type Period = 7 | 30;

type ChartDataPoint = {
  date: string;
  label: string;
  daily: number;
  cumulative: number;
  target: number | null;
};

function msToHours(ms: number) {
  return ms / 3600000;
}

export default function HoursChart({ records, targetHours }: Props) {
  const [period, setPeriod] = useState<Period>(7);

  const chartData = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - period * 86400000);

    const dailyMap = new Map<string, number>();

    for (const r of records) {
      if (!r.endTime) continue;
      const day = format(startOfDay(parseISO(r.startTime)), "yyyy-MM-dd");
      const dayDate = new Date(day + "T00:00:00");
      if (dayDate < cutoff) continue;
      const hours = msToHours(
        parseISO(r.endTime).getTime() - parseISO(r.startTime).getTime(),
      );
      dailyMap.set(day, (dailyMap.get(day) || 0) + hours);
    }

    const days: { date: string; hours: number }[] = [];
    const iter = new Date(cutoff);
    while (iter <= now) {
      const key = format(iter, "yyyy-MM-dd");
      days.push({ date: key, hours: dailyMap.get(key) || 0 });
      iter.setDate(iter.getDate() + 1);
    }

    let cumulative = 0;
    const totalDays = days.length;
    const data: ChartDataPoint[] = days.map((d, i) => {
      cumulative += d.hours;
      return {
        date: d.date,
        label: format(new Date(d.date + "T00:00:00"), "MMM d"),
        daily: Math.round(d.hours * 100) / 100,
        cumulative: Math.round(cumulative * 100) / 100,
        target:
          targetHours && targetHours > 0
            ? Math.round(((targetHours / totalDays) * (i + 1)) * 100) / 100
            : null,
      };
    });

    return data;
  }, [records, period, targetHours]);

  const dailyMax = Math.max(...chartData.map((d) => d.daily), 1);
  const yMax = Math.max(
    ...chartData.map((d) => Math.max(d.cumulative, d.target || 0)),
    dailyMax,
    1,
  );
  const yMaxRounded = Math.ceil(yMax * 2) / 2 || 1;

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated" className="!p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="m3-title-medium text-on-surface">Hours Overview</h2>
        <div className="flex gap-1">
          {([7, 30] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm m3-shape-sm transition-colors ${
                period === p
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {p}d
            </button>
          ))}
        </div>
      </div>

      <div className="w-full" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant, #c4c6d0)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--color-on-surface-variant, #49454f)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, yMaxRounded]}
              tick={{ fontSize: 11, fill: "var(--color-on-surface-variant, #49454f)" }}
              tickFormatter={(v: number) => `${v}h`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface, #fef7ff)",
                border: "1px solid var(--color-outline-variant, #c4c6d0)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="daily"
              name="Daily"
              stroke="var(--color-primary, #6750a4)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-primary, #6750a4)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              name="Cumulative"
              stroke="var(--color-tertiary, #7d5260)"
              strokeWidth={2.5}
              dot={false}
            />
            {targetHours && targetHours > 0 && (
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="var(--color-error, #b3261e)"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {targetHours && targetHours > 0 && chartData.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="inline-block w-3 h-0.5 bg-error" />
          Target pace: {targetHours}h over {chartData.length} days
        </div>
      )}
    </Card>
  );
}
