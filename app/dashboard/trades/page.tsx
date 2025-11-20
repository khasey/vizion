"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import {
  MyTrade,
  readAllTrades,
  writeAllTrades,
} from "@/components/trades/helpers";
import { Setup } from "@/components/analytics/types";

function readSetupsFromStorage(): Setup[] {
  try {
    const raw = localStorage.getItem("vizion:setups");
    if (!raw) return [];
    return JSON.parse(raw) as Setup[];
  } catch (e) {
    return [];
  }
}

export default function TradesPage() {
  const [trades, setTrades] = useState<MyTrade[]>([]);
  const [editing, setEditing] = useState<Record<string, Partial<MyTrade>>>({});

  const [setups, setSetups] = useState<Setup[]>([]);

  useEffect(() => {
    const all = readAllTrades();
    setTrades(all);
    setSetups(readSetupsFromStorage());
  }, []);

  function saveTrade(id: string) {
    const edit = editing[id];
    if (!edit) return;
    setTrades((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...edit } : t));
      writeAllTrades(next);
      return next;
    });
    setEditing((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  function deleteTrade(id: string) {
    setTrades((prev) => {
      const next = prev.filter((t) => t.id !== id);
      writeAllTrades(next);
      return next;
    });
  }

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

      <div className="rounded-xl border border-divider bg-white dark:bg-black p-4 overflow-x-auto">
        <table className="min-w-full w-full text-left table-auto">
          <thead>
            <tr className="text-sm text-default-500">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Instrument</th>
              <th className="px-3 py-2">Symbol</th>
              <th className="px-3 py-2">PnL</th>
              <th className="px-3 py-2">Setup</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {trades.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-default-50 dark:hover:bg-gray-900"
              >
                <td className="px-3 py-3 text-sm">{t.date}</td>
                <td className="px-3 py-3 text-sm">{t.instrument ?? "-"}</td>
                <td className="px-3 py-3 text-sm">{t.symbol}</td>
                <td
                  className={`px-3 py-3 text-sm font-semibold ${t.pnl >= 0 ? "text-success" : "text-danger"}`}
                >
                  {t.pnl >= 0 ? "+" : ""}
                  {t.pnl.toFixed(2)} €
                </td>
                <td className="px-3 py-3 text-sm">
                  <select
                    value={editing[t.id]?.setupId ?? t.setupId ?? ""}
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        [t.id]: {
                          ...(prev[t.id] ?? {}),
                          setupId: e.target.value,
                        },
                      }))
                    }
                    className="rounded-md border p-2 bg-transparent"
                  >
                    <option value="">None</option>
                    {setups.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 text-sm">
                  <select
                    value={editing[t.id]?.status ?? t.status ?? "Long"}
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        [t.id]: {
                          ...(prev[t.id] ?? {}),
                          status: e.target.value as any,
                        },
                      }))
                    }
                    className="rounded-md border p-2 bg-transparent"
                  >
                    <option value="Long">Long</option>
                    <option value="Short">Short</option>
                  </select>
                </td>
                <td className="px-3 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 rounded-md border text-sm"
                      onClick={() => saveTrade(t.id)}
                    >
                      Save
                    </button>
                    <button
                      className="px-2 py-1 rounded-md border text-sm text-destructive"
                      onClick={() => deleteTrade(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
