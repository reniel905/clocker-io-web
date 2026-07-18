"use client";

import { useMemo } from "react";
import type { TimeRecord } from "@/types";
import {
  parseISO,
  format,
  differenceInMinutes,
} from "date-fns";

type Props = {
  companyName: string;
  employeeName: string;
  position: string;
  department: string;
  month: string;
  year: number;
  regularStart: string;
  regularEnd: string;
  saturdayStart: string;
  saturdayEnd: string;
  records: TimeRecord[];
};

function formatTime(d: Date): string {
  return format(d, "hh:mm a");
}

function toTimeStr(minutes: number): string {
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

type DayData = {
  day: number;
  start: string;
  end: string;
  totalMinutes: number;
};

function buildDayData(
  day: number,
  records: TimeRecord[],
): DayData {
  const dayRecords = records
    .filter((r) => {
      const d = parseISO(r.startTime);
      return d.getDate() === day;
    })
    .sort(
      (a, b) =>
        parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime(),
    );

  if (dayRecords.length === 0) {
    return { day, start: "", end: "", totalMinutes: 0 };
  }

  const first = parseISO(dayRecords[0].startTime);
  const lastRecord = dayRecords[dayRecords.length - 1];
  const last = lastRecord.endTime ? parseISO(lastRecord.endTime) : null;

  const start = formatTime(first);
  const end = last ? formatTime(last) : "";
  const totalMinutes = last ? Math.max(0, differenceInMinutes(last, first)) : 0;

  return { day, start, end, totalMinutes };
}

export default function DtrDocument({
  companyName,
  employeeName,
  position,
  department,
  month,
  year,
  regularStart,
  regularEnd,
  saturdayStart,
  saturdayEnd,
  records,
}: Props) {
  const daysInMonth = new Date(year, new Date(`${month} 1, ${year}`).getMonth() + 1, 0).getDate();

  const dayData = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) =>
        buildDayData(i + 1, records),
      ),
    [daysInMonth, records],
  );

  const grandTotalMinutes = dayData.reduce((sum, d) => sum + d.totalMinutes, 0);

  return (
    <div className="dtr-document font-serif">
      <style jsx>{`
        .dtr-document {
          background: white;
          color: black;
          font-family: Georgia, "Times New Roman", serif;
          line-height: 1.2;
        }
        .dtr-table {
          margin: 0 auto;
          width: 50%;
          border-collapse: collapse;
          font-size: 9pt;
        }
        .dtr-table th,
        .dtr-table td {
          border: 1px solid black;
          padding: 3px 4px;
          vertical-align: middle;
        }
        .dtr-header-cell {
          text-align: center;
          padding: 6px 4px 4px;
        }
        .dtr-info-cell {
          padding: 3px 6px;
        }
        .dtr-info-row {
          font-size: 9pt;
          line-height: 1.6;
        }
        .dtr-col-headers th {
          background: #f5f5f5;
          text-align: center;
          font-size: 7.5pt;
          font-weight: 700;
          padding: 4px 2px;
          line-height: 1.2;
        }
        .dtr-col-day {
          width: 0.1%;
          text-align: center;
          font-size: 8pt;
        }
        .dtr-col-time {
          width: 0.5%;
          text-align: center;
          font-family: "Courier New", Courier, monospace;
          font-size: 8pt;
        }
        .dtr-col-hours {
          width: 0.5%;
          text-align: center;
          font-family: "Courier New", Courier, monospace;
          font-size: 8pt;
        }
        .dtr-data-row td {
          height: 17px;
        }
        .dtr-total-row td {
          border-top: 2px solid black;
          padding: 4px;
        }
        .dtr-cert-cell {
          padding: 8px 12px;
        }
        .dtr-cert-text {
          font-size: 8.5pt;
          font-style: italic;
          text-align: justify;
          line-height: 1.5;
          margin-bottom: 6px;
        }
        .dtr-verify-text {
          font-size: 8.5pt;
          font-weight: 700;
          text-align: left;
          margin-bottom: 2px;
          margin-top: 10px;
        }
        .dtr-signature-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 4px 0 6px;
        }
        .dtr-signature-line {
          width: 220px;
          border-bottom: 1px solid black;
          margin-top: 20px;
        }
        .dtr-signature-label {
          font-size: 8pt;
          text-align: center;
          margin-top: 1px;
        }
        @media print {
          .dtr-document {
            padding: 0;
          }
          .dtr-table {
            font-size: 8.5pt;
          }
          .dtr-col-headers th {
            background: #f5f5f5 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <table className="dtr-table">
        <thead>
          <tr>
            <th colSpan={4} className="dtr-header-cell">
              <div className="text-[11pt] sm:text-[14pt] font-bold tracking-wider text-center">
                DAILY TIME RECORD
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="dtr-info-cell">
              <div className="dtr-info-row">
                <span className="font-bold">Company:</span> {companyName || "____________________________"}
              </div>
              <div className="dtr-info-row">
                <span className="font-bold">Name:</span> {employeeName || "________________________________________"}
              </div>
              <div className="dtr-info-row">
                <span className="font-bold">Position:</span> {position || "____________________________"}
              </div>
              <div className="dtr-info-row">
                <span className="font-bold">Department:</span> {department || "____________________________"}
              </div>
              <div className="dtr-info-row mt-1">
                <span className="font-bold">For the month of</span> {month || "________"}{" "}
                <span className="font-bold">, {year || "____"}</span>
              </div>
            </td>
          </tr>

          <tr>
            <td colSpan={4} className="dtr-info-cell">
              <div className="dtr-info-row">
                <span className="font-bold">Official hours for arrival and departure:</span>
              </div>
              <div className="dtr-info-row pl-4">
                Regular Days: {regularStart || "______"} - {regularEnd || "______"}
              </div>
              <div className="dtr-info-row pl-4">
                Saturdays: {saturdayStart || "______"} - {saturdayEnd || "______"}
              </div>
            </td>
          </tr>

          <tr className="dtr-col-headers">
            <th className="dtr-col-day">DAY</th>
            <th className="dtr-col-time">START</th>
            <th className="dtr-col-time">END</th>
            <th className="dtr-col-hours">TOTAL HOURS</th>
          </tr>

          {dayData.map((d) => (
            <tr key={d.day} className="dtr-data-row">
              <td className="dtr-col-day">{d.day}</td>
              <td className="dtr-col-time">{d.start}</td>
              <td className="dtr-col-time">{d.end}</td>
              <td className="dtr-col-hours">
                {d.totalMinutes > 0 ? toTimeStr(d.totalMinutes) : ""}
              </td>
            </tr>
          ))}

          <tr className="dtr-total-row">
            <td className="dtr-col-day font-bold" colSpan={3}>
              TOTAL
            </td>
            <td className="dtr-col-hours font-bold">
              {grandTotalMinutes > 0 ? toTimeStr(grandTotalMinutes) : ""}
            </td>
          </tr>

          <tr>
            <td colSpan={4} className="dtr-cert-cell">
              <div className="dtr-cert-text">
                I CERTIFY on my honor that the above is a true and correct
                report of the hours of work performed, record of which was
                made daily at the time of arrival and departure from office.
              </div>
              <div className="dtr-signature-area">
                <div className="dtr-signature-line" />
                <div className="dtr-signature-label">(Signature of Employee)</div>
              </div>
              <div className="dtr-verify-text">
                VERIFIED as to the prescribed office hours:
              </div>
              <div className="dtr-signature-area">
                <div className="dtr-signature-line" />
                <div className="dtr-signature-label">In Charge</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
