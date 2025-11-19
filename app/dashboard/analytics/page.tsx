"use client";

import { Icon } from "@iconify/react";
import SetupsManager from "@/components/analytics/SetupsManager";
import SetupsLeaderboard from "@/components/analytics/SetupsLeaderboard";
import TimeOfDayHeatmap from "@/components/analytics/TimeOfDayHeatmap";
import { useEffect, useState } from "react";
import type { Setup } from "@/components/analytics/types";

export default function AnalyticsPage() {
  const [setups, setSetups] = useState<Setup[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vizion:setups");
      if (raw) setSetups(JSON.parse(raw));
    } catch (e) {
      setSetups([]);
    }
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon icon="mdi:chart-bar" className="text-xl" /> Analytics
      </h1>
      <div className="bg-white dark:bg-black rounded-xl border border-divider p-6">
        <div className="mb-6">
          <p className="text-default-600">Analytics and insights will appear here.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SetupsManager onChange={(s) => setSetups(s)} />
          </div>
          <div>
            <SetupsLeaderboard setups={setups} />
          </div>
        </div>
        <div className="mt-6">
          <TimeOfDayHeatmap setups={setups} />
        </div>
      </div>
    </div>
  );
}
