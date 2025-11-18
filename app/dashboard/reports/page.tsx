"use client";

import { Icon } from "@iconify/react";

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon icon="mdi:file-document" className="text-xl" /> Reports
      </h1>
      <div className="bg-white dark:bg-black rounded-xl border border-divider p-6 min-h-[300px]">
        <p className="text-default-600">Your reports will be available here.</p>
      </div>
    </div>
  );
}
