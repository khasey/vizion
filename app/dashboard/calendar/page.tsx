"use client";

import { Icon } from "@iconify/react";
import CalendarMonth from "@/components/calendar/CalendarMonth";

export default function CalendarPage() {
  return (
  <div className="p-6 h-full">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon icon="mdi:calendar" className="text-xl" /> Calendar
      </h1>
      <div>
        <CalendarMonth />
      </div>
      
    </div>
  );
}
