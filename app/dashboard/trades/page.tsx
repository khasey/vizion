"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";

export default function TradesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon icon="mdi:chart-line" className="text-xl" /> My Trades
      </h1>
      <div className="mb-6 flex justify-end">
        <Button color="primary" href="/dashboard/trades/new">
          <Icon icon="mdi:plus" className="text-xl mr-2" /> Add Trade
        </Button>
      </div>
      <div className="bg-white dark:bg-black rounded-xl border border-divider p-6 min-h-[300px]">
        <p className="text-default-600">No trades yet. Start by adding your first trade!</p>
      </div>
    </div>
  );
}
