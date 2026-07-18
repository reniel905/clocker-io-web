"use client";

import { useState, useEffect } from "react";

export default function ElapsedTimer({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    function update() {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, now - start);
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsed(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  return (
    <span className="font-mono text-5xl font-bold tracking-wider tabular-nums text-primary">
      {elapsed}
    </span>
  );
}
