"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { readAllTrades, writeAllTrades, MyTrade } from "@/components/trades/helpers";
import { useRouter } from "next/navigation";
import { Setup } from "@/components/analytics/types";

function readSetups(): Setup[] {
  try {
    const raw = localStorage.getItem("vizion:setups");
    if (!raw) return [];
    return JSON.parse(raw) as Setup[];
  } catch (e) {
    return [];
  }
}

export default function NewTrade() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [symbol, setSymbol] = useState("EUR/USD");
  const [instrument, setInstrument] = useState("Forex");
  const [pnl, setPnl] = useState(0);
  const [status, setStatus] = useState<MyTrade["status"]>("Long");
  const [setupId, setSetupId] = useState<string | undefined>(undefined);

  const setups = readSetups();

  function submit(e: any) {
    e.preventDefault();
    const all = readAllTrades();
    const next: MyTrade = { id: `${date}-${Date.now()}`, date, symbol, instrument, pnl: Number(pnl), status, setupId };
    const out = [next, ...all];
    writeAllTrades(out);
    router.push("/dashboard/trades");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon icon="mdi:plus" className="text-xl" /> New Trade
      </h1>
      <div className="rounded-xl border border-divider bg-white dark:bg-black p-6">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border p-2 bg-transparent" />
          </div>
          <div>
            <label className="text-xs">Symbol</label>
            <input value={symbol} onChange={e => setSymbol(e.target.value)} className="mt-1 block w-full rounded-md border p-2 bg-transparent" />
          </div>
          <div>
            <label className="text-xs">Instrument</label>
            <input value={instrument} onChange={e => setInstrument(e.target.value)} className="mt-1 block w-full rounded-md border p-2 bg-transparent" />
          </div>
          <div>
            <label className="text-xs">PnL</label>
            <input type="number" step="0.01" value={pnl} onChange={e => setPnl(Number(e.target.value))} className="mt-1 block w-full rounded-md border p-2 bg-transparent" />
          </div>
          <div>
            <label className="text-xs">Setup</label>
            <select value={setupId} onChange={e => setSetupId(e.target.value || undefined)} className="mt-1 block w-full rounded-md border p-2 bg-transparent">
              <option value="">None</option>
              {setups.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as any)} className="mt-1 block w-full rounded-md border p-2 bg-transparent">
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2 justify-end">
            <button type="button" className="px-3 py-1 rounded-md border" onClick={() => router.push("/dashboard/trades")}>Cancel</button>
            <button type="submit" className="px-3 py-1 rounded-md bg-primary text-white">Save Trade</button>
          </div>
        </form>
      </div>
    </div>
  );
}
