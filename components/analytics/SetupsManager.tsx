"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import type { Setup } from "@/components/analytics/types";

function uuidv4() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(4);
}

// Using shared Setup type from types.ts

const STORAGE_KEY = "vizion:setups";

function readFromStorage(): Setup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Setup[];
  } catch (e) {
    return [];
  }
}

function writeToStorage(setups: Setup[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setups));
  } catch (e) {
    // ignore
  }
}

export function SetupsManager({ onChange }: { onChange?: (setups: Setup[]) => void }) {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [editing, setEditing] = useState<Setup | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#00b4d8");
  const [description, setDescription] = useState("");
  const presets = [
    { name: "Momentum", color: "#f97316" },
    { name: "OPR", color: "#06b6d4" },
    { name: "Break & Retest", color: "#a78bfa" },
    { name: "Liquidity Grab", color: "#ef4444" },
  ];

  useEffect(() => {
    setSetups(readFromStorage());
  }, []);

  useEffect(() => {
    if (onChange) onChange(setups);
  }, [setups, onChange]);

  useEffect(() => {
    writeToStorage(setups);
  }, [setups]);

  function startNew() {
    setEditing({ id: uuidv4(), name: "", color: "#00b4d8", description: "" });
    setName("");
    setColor("#00b4d8");
    setDescription("");
  }

  function startEdit(s: Setup) {
    setEditing(s);
    setName(s.name);
    setColor(s.color);
    setDescription(s.description ?? "");
  }

  function cancelEdit() {
    setEditing(null);
    setName("");
    setColor("#00b4d8");
    setDescription("");
  }

  function save() {
    if (!name.trim()) return;
    const s: Setup = { id: editing?.id ?? uuidv4(), name: name.trim(), color, description: description.trim() };
    setSetups(prev => {
      const found = prev.find(p => p.id === s.id);
      let next: Setup[];
      if (found) {
        next = prev.map(p => (p.id === s.id ? s : p));
      } else {
        next = [s, ...prev].slice(0, 10);
      }
      return next;
    });
    cancelEdit();
  }

  function remove(id: string) {
    setSetups(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Icon icon="mdi:tools" className="text-xl" /> Setups
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-default-600">{setups.length}/10</span>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium border border-divider bg-white dark:bg-black hover:bg-default-50 disabled:opacity-60`}
            onClick={startNew}
            disabled={setups.length >= 10}
          >
            Create setup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {setups.map(s => (
          <div key={s.id} className="rounded-lg border border-divider bg-white dark:bg-black p-4 flex items-start gap-4">
            <div className="w-3 h-10 rounded-sm" style={{ background: s.color }} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold">{s.name}</div>
                <div className="flex items-center gap-2">
                  <button className="text-default-600 hover:text-primary text-sm" onClick={() => startEdit(s)}>
                    Edit
                  </button>
                  <button className="text-default-600 hover:text-destructive text-sm" onClick={() => remove(s.id)}>
                    Delete
                  </button>
                </div>
              </div>
              {s.description && <div className="text-default-600 text-sm">{s.description}</div>}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="rounded-lg border border-divider bg-white dark:bg-black p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-default-700 dark:text-default-300">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-divider p-2 bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-default-700 dark:text-default-300">Color</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="mt-1 w-16 h-10 rounded-md p-0 border-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-default-700 dark:text-default-300">Description (optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border border-divider p-2 bg-transparent" rows={3} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="px-3 py-1.5 bg-primary text-white rounded-md" onClick={save}>
              Save
            </button>
            <button className="px-3 py-1.5 rounded-md border border-divider" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {!editing && (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {presets.map(p => (
            <button
              key={p.name}
              className="rounded-md p-2 text-sm border border-divider flex items-center gap-2 hover:bg-default-50"
              onClick={() => {
                setEditing({ id: uuidv4(), name: p.name, color: p.color, description: "" });
                setName(p.name);
                setColor(p.color);
                setDescription("");
              }}
            >
              <div className="w-3 h-6 rounded-sm" style={{ background: p.color }} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SetupsManager;
