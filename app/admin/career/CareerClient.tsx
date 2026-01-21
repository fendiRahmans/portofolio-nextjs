"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import { Button } from "../../components/ui/Button";
import {
  CareerFormDialog,
  CareerItem,
} from "../../components/admin/CareerFormDialog";
import { DeleteConfirmDialog } from "../../components/ui/DeleteConfirmDialog";
import { createCareer, updateCareer, deleteCareer } from "@/actions/career";
import { useRouter } from "next/navigation";

// Color theme mapping for display
const colorThemes: Record<
  CareerItem["color"],
  { bg: string; text: string; border: string }
> = {
  primary: {
    bg: "bg-primary/20",
    text: "text-primary",
    border: "border-primary/30",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  amber: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  rose: {
    bg: "bg-rose-500/20",
    text: "text-rose-400",
    border: "border-rose-500/30",
  },
  indigo: {
    bg: "bg-indigo-500/20",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
  },
};

interface CareerClientProps {
  initialData: CareerItem[];
}

export default function CareerClient({ initialData }: CareerClientProps) {
  const [careers, setCareers] = useState<CareerItem[]>(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CareerItem | undefined>();
  const [deletingItem, setDeletingItem] = useState<CareerItem | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>();
  const router = useRouter();

  useEffect(() => {
    setCareers(initialData);
  }, [initialData]);

  // Handle add new career
  const handleAdd = () => {
    setEditingItem(undefined);
    setFieldErrors(undefined);
    setIsFormOpen(true);
  };

  // Handle edit career
  const handleEdit = (item: CareerItem) => {
    setEditingItem(item);
    setFieldErrors(undefined);
    setIsFormOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (item: CareerItem) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data: Omit<CareerItem, "id">) => {
    setIsLoading(true);
    setFieldErrors(undefined);

    try {
      const formData = new FormData();
      formData.append("year", data.year);
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("description", data.description);
      formData.append("icon", data.icon);
      formData.append("color", data.color);

      if (data.techStack && data.techStack.length > 0) {
        data.techStack.forEach((t) => formData.append("techStack", t));
      } else {
        // Send empty string to indicate empty array if needed, but simple omission might be enough if handled in server action
        formData.append("techStack", "");
      }

      if (data.keyProjects && data.keyProjects.length > 0) {
        data.keyProjects.forEach((k) => formData.append("keyProjects", k));
      } else {
        formData.append("keyProjects", "");
      }

      let result;

      if (editingItem) {
        // Update existing
        result = await updateCareer(parseInt(editingItem.id), {}, formData);
      } else {
        // Add new
        result = await createCareer({}, formData);
      }

      if (result.success) {
        router.refresh();
        setIsFormOpen(false);
        setEditingItem(undefined);
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        console.log("Validation/Server Error:", result.error);
      }
    } catch (error) {
      console.error("Failed to save career", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    setIsLoading(true);

    try {
      const result = await deleteCareer(parseInt(deletingItem.id));
      if (result.success) {
        setCareers((prev) => prev.filter((item) => item.id !== deletingItem.id));
        router.refresh();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Failed to delete career", error);
    } finally {
      setIsLoading(false);
      setIsDeleteOpen(false);
      setDeletingItem(undefined);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Career Timeline"
        subtitle="Manage your career journey"
      />

      <main className="flex-1 p-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">
              {careers.length} career entries
            </span>
          </div>
          <Button onClick={handleAdd} icon="add" className="!w-auto">
            Add Career
          </Button>
        </div>

        {/* Career Timeline List */}
        <div className="space-y-4">
          {careers.map((item) => {
            const theme = colorThemes[item.color];
            return (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-5 group hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center border ${theme.bg} ${theme.border} shrink-0`}
                  >
                    <span
                      className={`material-symbols-outlined text-[24px] ${theme.text}`}
                    >
                      {item.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1 border ${theme.bg} ${theme.text} ${theme.border}`}
                        >
                          {item.year}
                        </span>
                        <h4 className="text-white font-semibold text-lg">
                          {item.title}
                        </h4>
                        <p className="text-white/60 text-sm">{item.subtitle}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleEdit(item)}
                          className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="size-8 rounded-lg flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>

                    <p className="text-white/40 text-sm mt-2 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Tech Stack */}
                    {item.techStack && item.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Key Projects */}
                    {item.keyProjects && item.keyProjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.keyProjects.slice(0, 4).map((project, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded border text-xs ${theme.bg} ${theme.text} ${theme.border}`}
                          >
                            {project}
                          </span>
                        ))}
                        {item.keyProjects.length > 4 && (
                          <span className="px-2 py-1 text-xs text-white/40">
                            +{item.keyProjects.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {careers.length === 0 && (
          <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white/40 text-[32px]">
                work_history
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No career entries yet
            </h3>
            <p className="text-white/50 text-sm mb-4">
              Add your first career entry to showcase your journey
            </p>
            <Button onClick={handleAdd} icon="add" className="!w-auto">
              Add Career
            </Button>
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <CareerFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(undefined);
          setFieldErrors(undefined);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        isLoading={isLoading}
        errors={fieldErrors}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingItem(undefined);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Career Entry"
        message="Are you sure you want to delete this career entry from your timeline?"
        itemName={deletingItem?.title}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}
