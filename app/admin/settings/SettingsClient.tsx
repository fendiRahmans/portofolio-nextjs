"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import { Button } from "../../components/ui/Button";
import {
  SettingFormDialog,
  SettingItem,
} from "../../components/admin/SettingFormDialog";
import { DeleteConfirmDialog } from "../../components/ui/DeleteConfirmDialog";
import { createSetting, updateSetting, deleteSetting } from "@/actions/settings";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
  initialData: SettingItem[];
}

export default function SettingsClient({ initialData }: SettingsClientProps) {
  const [settings, setSettings] = useState<SettingItem[]>(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SettingItem | undefined>();
  const [deletingItem, setDeletingItem] = useState<SettingItem | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Sync state with initialData when it changes (e.g. after router.refresh)
  useEffect(() => {
    setSettings(initialData);
  }, [initialData]);

  // Handle add new setting
  const handleAdd = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  // Handle edit setting
  const handleEdit = (item: SettingItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (item: SettingItem) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data: Omit<SettingItem, "id">) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("value", data.value);

      if (editingItem) {
        // Update existing
        const result = await updateSetting(editingItem.id, {}, formData);
        if (result.success) {
          router.refresh();
          setSettings((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? { ...item, ...data } : item
            )
          );
        } else {
          console.error(result.error);
        }
      } else {
        // Add new
        const result = await createSetting({}, formData);
        if (result.success) {
          router.refresh();
        } else {
          console.error(result.error);
        }
      }
      setIsFormOpen(false);
      setEditingItem(undefined);
    } catch (error) {
      console.error("Failed to save setting", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    setIsLoading(true);
    try {
      const result = await deleteSetting(deletingItem.id);
      if (result.success) {
        setSettings((prev) =>
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
        title="Settings"
        subtitle="Manage application settings"
      />

      <main className="flex-1 p-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">
              {settings.length} settings
            </span>
          </div>
          <Button onClick={handleAdd} icon="add" className="!w-auto">
            Add Setting
          </Button>
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          {settings.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-2xl p-5 flex items-center justify-between group hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      settings
                    </span>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">
                      {item.name}
                    </p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </div>
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
          ))}
        </div>

        {/* Empty State */}
        {settings.length === 0 && (
          <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white/40 text-[32px]">
                settings
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No settings yet
            </h3>
            <p className="text-white/50 text-sm mb-4">
              Add your first setting to configure your application
            </p>
            <Button onClick={handleAdd} icon="add" className="!w-auto">
              Add Setting
            </Button>
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <SettingFormDialog
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
        title="Delete Setting"
        message="Are you sure you want to delete this setting?"
        itemName={deletingItem?.name}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}
