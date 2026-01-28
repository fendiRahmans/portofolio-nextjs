"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import { Button } from "../../components/ui/Button";
import {
  TechStackFormDialog,
  TechStackItem,
} from "../../components/admin/TechStackFormDialog";
import { DeleteConfirmDialog } from "../../components/ui/DeleteConfirmDialog";
import { createTechStack, updateTechStack, deleteTechStack } from "@/actions/tech-stack";
import { useRouter } from "next/navigation";

interface TechStackClientProps {
  initialData: TechStackItem[];
}

export default function TechStackClient({ initialData }: TechStackClientProps) {
  const [techStack, setTechStack] = useState<TechStackItem[]>(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TechStackItem | undefined>();
  const [deletingItem, setDeletingItem] = useState<TechStackItem | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Sync state with initialData when it changes (e.g. after router.refresh)
  useEffect(() => {
    setTechStack(initialData);
  }, [initialData]);

  // Handle add new technology
  const handleAdd = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  // Handle edit technology
  const handleEdit = (item: TechStackItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (item: TechStackItem) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data: Omit<TechStackItem, "id">) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("iconName", data.iconName);
      formData.append("iconColor", data.iconColor);
      formData.append("bgColor", data.bgColor);

      if (editingItem) {
        // Update existing
        const result = await updateTechStack(editingItem.id, {}, formData);
        if (result.success) {
          // Optimistic update or router refresh
          router.refresh(); // Refresh server data
          setTechStack((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? { ...item, ...data } : item
            )
          );
        } else {
          console.error(result.error);
          // Could add toast here
        }
      } else {
        // Add new
        const result = await createTechStack({}, formData);
        if (result.success) {
          router.refresh();
          // We don't have the new ID immediately unless we modify action to return it.
          // For now, refresh might be enough, but to update UI immediately we need ID.
          // Let's rely on router.refresh() for real data, 
          // but for instant feedback we might need to properly reload.
          // Since we are inside client component, strict consistency requires re-fetch.
        } else {
          console.error(result.error);
        }
      }
      setIsFormOpen(false);
      setEditingItem(undefined);
    } catch (error) {
      console.error("Failed to save tech stack", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    setIsLoading(true);
    try {
      const result = await deleteTechStack(deletingItem.id);
      if (result.success) {
        setTechStack((prev) =>
          prev.filter((item) => item.id !== deletingItem.id)
        );
        router.refresh();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setIsLoading(false);
      setIsDeleteOpen(false);
      setDeletingItem(undefined);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Tech Stack"
        subtitle="Manage your core technologies"
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">
              {techStack.length} technologies
            </span>
          </div>
          <Button onClick={handleAdd} icon="add" className="!w-auto">
            Add Technology
          </Button>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {techStack.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-2xl p-5 flex flex-col gap-4 group hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div
                  className="size-12 rounded-xl flex items-center justify-center border border-white/10"
                  style={{ backgroundColor: `${item.bgColor}20` }}
                >
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ color: item.iconColor }}
                  >
                    {item.iconName}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
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

              <div>
                <h4 className="text-white font-semibold text-lg">
                  {item.title}
                </h4>
                <p className="text-white/40 text-sm mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {techStack.length === 0 && (
          <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white/40 text-[32px]">
                layers
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No technologies yet
            </h3>
            <p className="text-white/50 text-sm mb-4">
              Add your first technology to showcase your skills
            </p>
            <Button onClick={handleAdd} icon="add" className="!w-auto">
              Add Technology
            </Button>
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <TechStackFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(undefined);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingItem(undefined);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Technology"
        message="Are you sure you want to delete this technology from your stack?"
        itemName={deletingItem?.title}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}
