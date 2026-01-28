"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface InterestsEditorProps {
  value: string[];
  onChange: (newValue: string[]) => void;
}

export default function InterestsEditor({
  value = [],
  onChange,
}: InterestsEditorProps) {
  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];
  const [newItem, setNewItem] = useState("");

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newItem.trim()) {
      if (!safeValue.includes(newItem.trim())) {
        onChange([...safeValue, newItem.trim()]);
      }
      setNewItem("");
    }
  };

  const handleRemove = (itemToRemove: string) => {
    onChange(safeValue.filter((item) => item !== itemToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Interests</h3>

      <div className="flex gap-2">
        <Input
          placeholder="Add an interest..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          containerClassName="flex-1"
        />
        <Button type="button" onClick={() => handleAdd()} icon="add" className="!w-auto">
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {safeValue.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/5 animate-scale-in"
          >
            <span className="text-white text-sm">{item}</span>
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="text-white/40 hover:text-red-400 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          </div>
        ))}
        {safeValue.length === 0 && (
          <div className="text-white/30 text-sm italic py-2">
            No interests added yet
          </div>
        )}
      </div>
    </div>
  );
}
