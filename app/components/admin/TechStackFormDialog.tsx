"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { techStackSchema } from "@/lib/validations";

export interface TechStackItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
}

interface TechStackFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TechStackItem, "id">) => void;
  initialData?: TechStackItem;
  isLoading?: boolean;
}

export const TechStackFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: TechStackFormDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconName: "",
    iconColor: "#ffffff",
    bgColor: "#195de6",
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] | undefined }>({});

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          description: initialData.description,
          iconName: initialData.iconName,
          iconColor: initialData.iconColor,
          bgColor: initialData.bgColor,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          iconName: "",
          iconColor: "#ffffff",
          bgColor: "#195de6",
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = techStackSchema.safeParse(formData);

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
      title={isEditMode ? "Edit Technology" : "Add Technology"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" icon="title">
            Title
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g. Next.js"

          />
          {errors.title && (
            <p className="text-red-400 text-xs">{errors.title[0]}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" icon="description">
            Description
          </Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="e.g. App Router, SSR, Server Actions"

          />
          {errors.description && (
            <p className="text-red-400 text-xs">{errors.description[0]}</p>
          )}
        </div>

        {/* Icon Name */}
        <div className="space-y-2">
          <Label htmlFor="iconName" icon="deployed_code">
            Material Icon Name
          </Label>
          <Input
            id="iconName"
            value={formData.iconName}
            onChange={(e) =>
              setFormData({ ...formData, iconName: e.target.value })
            }
            placeholder="e.g. code_blocks, layers, palette"

          />
          {errors.iconName && (
            <p className="text-red-400 text-xs">{errors.iconName[0]}</p>
          )}
          <p className="text-white/40 text-xs">
            Browse icons at{" "}
            <a
              href="https://fonts.google.com/icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              fonts.google.com/icons
            </a>
          </p>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="iconColor" icon="palette">
              Icon Color
            </Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="iconColor"
                value={formData.iconColor}
                onChange={(e) =>
                  setFormData({ ...formData, iconColor: e.target.value })
                }
                className="size-12 rounded-lg cursor-pointer bg-transparent border border-white/10"
              />
              <Input
                value={formData.iconColor}
                onChange={(e) =>
                  setFormData({ ...formData, iconColor: e.target.value })
                }
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bgColor" icon="format_color_fill">
              Background Color
            </Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="bgColor"
                value={formData.bgColor}
                onChange={(e) =>
                  setFormData({ ...formData, bgColor: e.target.value })
                }
                className="size-12 rounded-lg cursor-pointer bg-transparent border border-white/10"
              />
              <Input
                value={formData.bgColor}
                onChange={(e) =>
                  setFormData({ ...formData, bgColor: e.target.value })
                }
                placeholder="#195de6"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label icon="visibility">Preview</Label>
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div
              className="size-12 rounded-xl flex items-center justify-center border border-white/10"
              style={{ backgroundColor: `${formData.bgColor}20` }}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ color: formData.iconColor }}
              >
                {formData.iconName || "code"}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold">
                {formData.title || "Technology Name"}
              </p>
              <p className="text-white/40 text-sm">
                {formData.description || "Description here"}
              </p>
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
            {isEditMode ? "Update" : "Add Technology"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
