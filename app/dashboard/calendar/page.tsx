"use client";

import { Icon } from "@iconify/react";
import { tradingDays } from "./data";

export default function CalendarPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon icon="mdi:calendar" className="text-xl" /> Calendar
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tradingDays.map((day) => {
          const isPositive = day.pnl > 0;
          const isZero = day.pnl === 0;
          return (
            <div
              key={day.date}
              className={`rounded-2xl border p-4 flex flex-col gap-2 shadow transition-colors
                ${isPositive ? "bg-success/10 border-success" : isZero ? "bg-default-100 border-divider" : "bg-danger/10 border-danger"}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-default-500">{new Date(day.date).toLocaleDateString()}</span>
                <Icon icon={isPositive ? "mdi:trending-up" : isZero ? "mdi:minus" : "mdi:trending-down"} className={`text-lg ${isPositive ? "text-success" : isZero ? "text-default-500" : "text-danger"}`} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold ${isPositive ? "text-success" : isZero ? "text-default-600" : "text-danger"}`}>
                  {day.pnl > 0 ? "+" : day.pnl < 0 ? "-" : ""}{Math.abs(day.pnl).toFixed(2)} €
                </span>
                <span className="text-xs text-default-500">PNL réalisé</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
