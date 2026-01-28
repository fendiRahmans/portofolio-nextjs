"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Dialog } from "../ui/Dialog";
import { DeleteConfirmDialog } from "../ui/DeleteConfirmDialog";
import { Label } from "../ui/Label";
import { TextArea } from "../ui/TextArea";

interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

interface CoreValuesEditorProps {
  value: CoreValue[];
  onChange: (newValue: CoreValue[]) => void;
}

// Separate form component to prevent unnecessary re-renders
const CoreValueForm = React.memo(({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
}: {
  formData: CoreValue;
  onInputChange: (field: keyof CoreValue, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Icon (Google Material Symbol)</Label>
      <Input
        placeholder="e.g. bolt"
        value={formData.icon}
        onChange={(e) => onInputChange("icon", e.target.value)}
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Title</Label>
      <Input
        placeholder="e.g. Fast Performance"
        value={formData.title}
        onChange={(e) => onInputChange("title", e.target.value)}
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Description</Label>
      <TextArea
        placeholder="Brief description..."
        value={formData.description}
        onChange={(e) => onInputChange("description", e.target.value)}
        required
        className="min-h-[100px]"
      />
    </div>
    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="glass"
        onClick={onCancel}
        className="!w-auto"
      >
        Cancel
      </Button>
      <Button 
        type="button" 
        onClick={onSubmit} 
        className="!w-auto"
      >
        Save
      </Button>
    </div>
  </div>
), (prevProps, nextProps) => {
  // Custom comparison - re-render only if formData really changed
  return (
    prevProps.formData === nextProps.formData &&
    prevProps.onInputChange === nextProps.onInputChange &&
    prevProps.onSubmit === nextProps.onSubmit &&
    prevProps.onCancel === nextProps.onCancel
  );
});

export default function CoreValuesEditor({
  value = [],
  onChange,
}: CoreValuesEditorProps) {
  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<CoreValue>({
    icon: "",
    title: "",
    description: "",
  });
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleInputChange = useCallback((field: keyof CoreValue, newValue: string) => {
    setFormData((prev) => ({ ...prev, [field]: newValue }));
  }, []);

  const handleAdd = useCallback(() => {
    setEditingIndex(null);
    setFormData({ icon: "", title: "", description: "" });
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback((index: number) => {
    setEditingIndex(index);
    setFormData(value[index]);
    setIsDialogOpen(true);
  }, [value]);

  const handleDeleteClick = useCallback((index: number) => {
    setDeletingIndex(index);
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingIndex !== null) {
      const newValue = [...value];
      newValue.splice(deletingIndex, 1);
      onChange(newValue);
      setDeletingIndex(null);
      setIsDeleteOpen(false);
    }
  }, [deletingIndex, value, onChange]);

  const handleSubmit = useCallback(() => {
    // Validate required fields
    if (!formData.icon.trim() || !formData.title.trim() || !formData.description.trim()) {
      return;
    }

    if (editingIndex !== null) {
      // Edit
      const newValue = [...value];
      newValue[editingIndex] = formData;
      onChange(newValue);
    } else {
      // Add
      onChange([...value, formData]);
    }
    setIsDialogOpen(false);
  }, [formData, editingIndex, value, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Core Values</h3>
        <Button type="button" onClick={handleAdd} icon="add" className="!w-auto !py-2 !px-4 text-sm">
          Add Value
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeValue.map((item, index) => (
          <div
            key={index}
            className="glass-panel p-4 rounded-xl relative group hover:bg-white/5 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white">
                  {item.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{item.title}</h4>
                <p className="text-white/50 text-sm line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleEdit(index)}
                className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(index)}
                className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
              </button>
            </div>
          </div>
        ))}

        {safeValue.length === 0 && (
          <div className="col-span-full py-8 text-center text-white/30 border border-dashed border-white/10 rounded-xl">
            No core values added yet
          </div>
        )}
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={editingIndex !== null ? "Edit Core Value" : "Add Core Value"}
      >
        <CoreValueForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={handleCloseDialog}
        />
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Core Value"
        itemName={safeValue[deletingIndex ?? 0]?.title}
      />
    </div>
  );
}
