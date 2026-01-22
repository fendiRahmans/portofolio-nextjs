"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { settingSchema } from "@/lib/validations";

export interface SettingItem {
  id: number;
  name: string;
  value: string;
}

interface SettingFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SettingItem, "id">) => void;
  initialData?: SettingItem;
  isLoading?: boolean;
}

export const SettingFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: SettingFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] | undefined }>({});

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          value: initialData.value,
        });
      } else {
        setFormData({
          name: "",
          value: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = settingSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const isEditMode = !!initialData;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Setting" : "Add Setting"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" icon="label">
            Setting Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g. available_for_hire, site_title"
            disabled={isEditMode} // Disable editing name in edit mode
          />
          {errors.name && (
            <p className="text-red-400 text-xs">{errors.name[0]}</p>
          )}
          {!isEditMode && (
            <p className="text-white/40 text-xs">
              Use lowercase with underscores for setting names
            </p>
          )}
        </div>

        {/* Value */}
        <div className="space-y-2">
          <Label htmlFor="value" icon="text_fields">
            Setting Value
          </Label>
          <Input
            id="value"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            placeholder="e.g. true, My Portfolio, 123"
          />
          {errors.value && (
            <p className="text-red-400 text-xs">{errors.value[0]}</p>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label icon="visibility">Preview</Label>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                  {formData.name || "setting_name"}
                </p>
                <p className="text-white font-medium">
                  {formData.value || "Setting value will appear here"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="glass"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            {isEditMode ? "Update" : "Add Setting"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
