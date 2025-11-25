"use client";

import { Icon } from "@iconify/react";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon icon="mdi:cog" className="text-xl" /> Settings
      </h1>
      <div className="bg-white dark:bg-black rounded-xl border border-divider p-6 min-h-[300px]">
        <p className="text-default-600">Manage your dashboard settings here.</p>
      </div>
    </div>
  );
}
