import type { TimeRecord } from "@/types";
import { startOfWeek, endOfWeek, startOfDay, endOfDay, parseISO, isWithinInterval } from "date-fns";
import Card from "@/components/ui/Card";

type Props = {
  records: TimeRecord[];
};

function msToHours(ms: number) {
  return (ms / 3600000).toFixed(1);
}

export default function DashboardStats({ records }: Props) {
  const now = new Date();

  const todayRecords = records.filter((r) => {
    const start = parseISO(r.startTime);
    return isWithinInterval(start, { start: startOfDay(now), end: endOfDay(now) });
  });

  const weekRecords = records.filter((r) => {
    const start = parseISO(r.startTime);
    return isWithinInterval(start, { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) });
  });

  const todayMs = todayRecords.reduce((acc, r) => {
    if (r.endTime) return acc + (parseISO(r.endTime).getTime() - parseISO(r.startTime).getTime());
    return acc + (now.getTime() - parseISO(r.startTime).getTime());
  }, 0);

  const weekMs = weekRecords.reduce((acc, r) => {
    if (r.endTime) return acc + (parseISO(r.endTime).getTime() - parseISO(r.startTime).getTime());
    return acc + (now.getTime() - parseISO(r.startTime).getTime());
  }, 0);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card variant="elevated">
        <p className="m3-label-small text-on-surface-variant uppercase">Today</p>
        <p className="mt-1 m3-headline-medium text-primary">{msToHours(todayMs)}h</p>
      </Card>
      <Card variant="elevated">
        <p className="m3-label-small text-on-surface-variant uppercase">This Week</p>
        <p className="mt-1 m3-headline-medium text-primary">{msToHours(weekMs)}h</p>
      </Card>
    </div>
  );
}
