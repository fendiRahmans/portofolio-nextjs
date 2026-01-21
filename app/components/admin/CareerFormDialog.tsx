"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";

export type CareerColor =
  | "primary"
  | "cyan"
  | "purple"
  | "amber"
  | "emerald"
  | "rose"
  | "indigo";

export interface CareerItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: CareerColor;
  keyProjects?: string[];
  projectList?: { name: string; type?: string }[];
  techStack?: string[];
  bulletPoints?: string[];
}

interface CareerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CareerItem, "id">) => void;
  initialData?: CareerItem;
  isLoading?: boolean;
  errors?: Record<string, string[]>;
}

const colorOptions: { value: CareerColor; label: string; class: string }[] = [
  { value: "primary", label: "Primary (Blue)", class: "bg-primary" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "amber", label: "Amber", class: "bg-amber-500" },
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { value: "rose", label: "Rose", class: "bg-rose-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
];

export const CareerFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  errors,
}: CareerFormDialogProps) => {
  const [formData, setFormData] = useState({
    year: "",
    title: "",
    subtitle: "",
    description: "",
    icon: "",
    color: "primary" as CareerColor,
    techStack: "",
    keyProjects: "",
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          year: initialData.year,
          title: initialData.title,
          subtitle: initialData.subtitle,
          description: initialData.description,
          icon: initialData.icon,
          color: initialData.color,
          techStack: initialData.techStack?.join(", ") || "",
          keyProjects: initialData.keyProjects?.join(", ") || "",
        });
      } else {
        setFormData({
          year: "",
          title: "",
          subtitle: "",
          description: "",
          icon: "",
          color: "primary",
          techStack: "",
          keyProjects: "",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techStackArray = formData.techStack
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const keyProjectsArray = formData.keyProjects
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onSubmit({
      year: formData.year,
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      techStack: techStackArray.length > 0 ? techStackArray : undefined,
      keyProjects: keyProjectsArray.length > 0 ? keyProjectsArray : undefined,
    });
  };

  const isEditMode = !!initialData;

  const getColorTheme = (color: CareerColor) => {
    const themes = {
      primary: {
        pill: "bg-primary/20 border-primary/20 text-primary-100",
        iconBg: "bg-primary/10 border-primary/20",
        iconColor: "text-primary",
      },
      cyan: {
        pill: "bg-cyan-500/10 border-cyan-500/20 text-cyan-200",
        iconBg: "bg-cyan-500/10 border-cyan-500/20",
        iconColor: "text-cyan-400",
      },
      purple: {
        pill: "bg-purple-500/10 border-purple-500/20 text-purple-200",
        iconBg: "bg-purple-500/10 border-purple-500/20",
        iconColor: "text-purple-400",
      },
      amber: {
        pill: "bg-amber-500/10 border-amber-500/20 text-amber-200",
        iconBg: "bg-amber-500/10 border-amber-500/20",
        iconColor: "text-amber-400",
      },
      emerald: {
        pill: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
        iconBg: "bg-emerald-500/10 border-emerald-500/20",
        iconColor: "text-emerald-400",
      },
      rose: {
        pill: "bg-rose-500/10 border-rose-500/20 text-rose-200",
        iconBg: "bg-rose-500/10 border-rose-500/20",
        iconColor: "text-rose-400",
      },
      indigo: {
        pill: "bg-indigo-500/10 border-indigo-500/20 text-indigo-200",
        iconBg: "bg-indigo-500/10 border-indigo-500/20",
        iconColor: "text-indigo-400",
      },
    };
    return themes[color];
  };

  const theme = getColorTheme(formData.color);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Career" : "Add Career"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year" icon="calendar_today">
              Year / Period
            </Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              placeholder="e.g. 2025 — Present"
            />
            {errors?.year && <p className="text-red-400 text-xs mt-1">{errors.year[0]}</p>}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color" icon="palette">
              Color Theme
            </Label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, color: option.value })
                  }
                  className={`size-8 rounded-lg ${option.class} transition-all duration-300 border-2 ${formData.color === option.value
                    ? "border-white scale-110"
                    : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>
        </div>

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
            placeholder="e.g. Izidok & Hitalent"
          />
          {errors?.title && <p className="text-red-400 text-xs mt-1">{errors.title[0]}</p>}
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label htmlFor="subtitle" icon="badge">
            Subtitle / Role
          </Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            placeholder="e.g. Lead Fullstack & Mobile Architect"
          />
          {errors?.subtitle && <p className="text-red-400 text-xs mt-1">{errors.subtitle[0]}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" icon="description">
            Description
          </Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your role and achievements..."

            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 resize-none"
          />
          {errors?.description && <p className="text-red-400 text-xs mt-1">{errors.description[0]}</p>}
        </div>

        {/* Icon */}
        <div className="space-y-2">
          <Label htmlFor="icon" icon="deployed_code">
            Material Icon Name
          </Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="e.g. devices, code_blocks, apartment"
          />
          {errors?.icon && <p className="text-red-400 text-xs mt-1">{errors.icon[0]}</p>}
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

        {/* Tech Stack */}
        <div className="space-y-2">
          <Label htmlFor="techStack" icon="layers">
            Tech Stack (comma separated)
          </Label>
          <Input
            id="techStack"
            value={formData.techStack}
            onChange={(e) =>
              setFormData({ ...formData, techStack: e.target.value })
            }
            placeholder="e.g. Laravel, Vue.js, Flutter, Dart"
          />
        </div>

        {/* Key Projects */}
        <div className="space-y-2">
          <Label htmlFor="keyProjects" icon="folder_special">
            Key Projects (comma separated)
          </Label>
          <Input
            id="keyProjects"
            value={formData.keyProjects}
            onChange={(e) =>
              setFormData({ ...formData, keyProjects: e.target.value })
            }
            placeholder="e.g. Project A, Project B, Project C"
          />
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label icon="visibility">Preview</Label>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 border ${theme.pill}`}
                >
                  {formData.year || "2025"}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {formData.title || "Career Title"}
                </h3>
                <p className="text-white/60 text-sm">
                  {formData.subtitle || "Subtitle / Role"}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${theme.iconBg}`}
              >
                <span className={`material-symbols-outlined ${theme.iconColor}`}>
                  {formData.icon || "work"}
                </span>
              </div>
            </div>
            <p className="text-white/70 text-sm mt-3 line-clamp-2">
              {formData.description || "Description will appear here..."}
            </p>
            {formData.techStack && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                {formData.techStack.split(",").slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            )}
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
            {isEditMode ? "Update" : "Add Career"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
