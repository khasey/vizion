"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getStrategies, createStrategy, updateStrategy, deleteStrategy } from "@/app/actions/strategies";
import type { Strategy } from "@/types/strategies";

export function SetupsManager({ onChange }: { onChange?: () => void }) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Strategy | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#00b4d8");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const presets = [
    { name: "Momentum", color: "#f97316" },
    { name: "OPR", color: "#06b6d4" },
    { name: "Break & Retest", color: "#a78bfa" },
    { name: "Liquidity Grab", color: "#ef4444" },
  ];

  useEffect(() => {
    fetchStrategies();
  }, []);

  async function fetchStrategies() {
    setLoading(true);
    const result = await getStrategies();
    if (result.data) {
      setStrategies(result.data);
    }
    setLoading(false);
  }

  function startNew() {
    setEditing({ name: "", color: "#00b4d8", description: "", user_id: "" });
    setName("");
    setColor("#00b4d8");
    setDescription("");
  }

  function startEdit(s: Strategy) {
    setEditing(s);
    setName(s.name);
    setColor(s.color || "#00b4d8");
    setDescription(s.description ?? "");
  }

  function cancelEdit() {
    setEditing(null);
    setName("");
    setColor("#00b4d8");
    setDescription("");
    setError(null);
  }

  async function save() {
    if (!name.trim()) return;
    setError(null);
    
    if (editing?.id) {
      // Update existing
      const result = await updateStrategy(editing.id, {
        name: name.trim(),
        color,
        description: description.trim() || null,
      });
      if (result.error) {
        if (result.error.includes("duplicate key")) {
          setError("A strategy with this name already exists");
        } else {
          setError(result.error);
        }
        return;
      }
    } else {
      // Create new
      const result = await createStrategy({
        name: name.trim(),
        color,
        description: description.trim() || null,
      });
      if (result.error) {
        if (result.error.includes("duplicate key")) {
          setError("A strategy with this name already exists");
        } else {
          setError(result.error);
        }
        return;
      }
    }
    
    await fetchStrategies();
    cancelEdit();
    if (onChange) onChange();
  }

  async function remove(id: string) {
    const result = await deleteStrategy(id);
    if (result.error) {
      console.error("Error deleting strategy:", result.error);
      return;
    }
    await fetchStrategies();
    if (onChange) onChange();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Icon icon="mdi:tools" className="text-xl" /> Setups
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-default-600">{strategies.length}</span>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium border border-divider bg-white dark:bg-black hover:bg-default-50 disabled:opacity-60`}
            onClick={startNew}
            disabled={loading}
          >
            Create setup
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-default-600">Loading strategies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map(s => (
            <div key={s.id} className="rounded-lg border border-divider bg-white dark:bg-black p-4 flex items-start gap-4">
              <div className="w-3 h-10 rounded-sm" style={{ background: s.color || "#3b82f6" }} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold">{s.name}</div>
                  <div className="flex items-center gap-2">
                    <button className="text-default-600 hover:text-primary text-sm cursor-pointer" onClick={() => startEdit(s)}>
                      Edit
                    </button>
                    <button 
                      className="p-1 rounded-lg text-default-400 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer" 
                      onClick={() => s.id && remove(s.id)}
                      title="Supprimer ce setup"
                    >
                      <Icon icon="mdi:trash-can-outline" className="text-lg" />
                    </button>
                  </div>
                </div>
                {s.description && <div className="text-default-600 text-sm">{s.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="rounded-lg border border-divider bg-white dark:bg-black p-4">
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger rounded-md text-danger text-sm">
              {error}
            </div>
          )}
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
                setEditing({ name: p.name, color: p.color, description: "", user_id: "" });
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
