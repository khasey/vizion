"use client";

import { Icon } from "@iconify/react";

export default function BrokersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon icon="mdi:connection" className="text-xl" /> Brokers
      </h1>
      <div className="bg-white dark:bg-black rounded-xl border border-divider p-6 min-h-[300px]">
        <p className="text-default-600">Connect your broker accounts here.</p>
      </div>
    </div>
  );
}
