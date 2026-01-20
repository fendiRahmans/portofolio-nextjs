"use client";

import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import { Button } from "../../components/ui/Button";
import {
  TechStackFormDialog,
  TechStackItem,
} from "../../components/admin/TechStackFormDialog";
import { DeleteConfirmDialog } from "../../components/ui/DeleteConfirmDialog";

// Initial static data - matches the original TechStack component
const initialTechStack: TechStackItem[] = [
  {
    id: "1",
    title: "Next.js",
    description: "App Router, SSR, Server Actions",
    iconName: "code_blocks",
    iconColor: "#ffffff",
    bgColor: "#000000",
  },
  {
    id: "2",
    title: "TypeScript",
    description: "Strict typing, Interfaces, Generics",
    iconName: "code",
    iconColor: "#ffffff",
    bgColor: "#3178C6",
  },
  {
    id: "3",
    title: "Tailwind CSS",
    description: "Design Systems, Animation, JIT",
    iconName: "palette",
    iconColor: "#38BDF8",
    bgColor: "#38BDF8",
  },
  {
    id: "4",
    title: "Node.js",
    description: "Express, NestJS, Microservices",
    iconName: "dns",
    iconColor: "#339933",
    bgColor: "#339933",
  },
  {
    id: "5",
    title: "Flutter",
    description: "Cross-platform, Dart, Riverpod",
    iconName: "smartphone",
    iconColor: "#02569B",
    bgColor: "#02569B",
  },
  {
    id: "6",
    title: "PostgreSQL",
    description: "Supabase, Prisma, SQL",
    iconName: "database",
    iconColor: "#F97316",
    bgColor: "#F97316",
  },
  {
    id: "7",
    title: "DevOps & Tools",
    description: "Docker, AWS, Git, Figma",
    iconName: "terminal",
    iconColor: "#ffffff",
    bgColor: "#6366F1",
  },
];

export default function AdminTechStack() {
  const [techStack, setTechStack] =
    useState<TechStackItem[]>(initialTechStack);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TechStackItem | undefined>();
  const [deletingItem, setDeletingItem] = useState<TechStackItem | undefined>();
  const [isLoading, setIsLoading] = useState(false);

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
  const handleFormSubmit = (data: Omit<TechStackItem, "id">) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editingItem) {
        // Update existing
        setTechStack((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, ...data } : item
          )
        );
      } else {
        // Add new
        const newItem: TechStackItem = {
          ...data,
          id: Date.now().toString(),
        };
        setTechStack((prev) => [...prev, newItem]);
      }

      setIsLoading(false);
      setIsFormOpen(false);
      setEditingItem(undefined);
    }, 500);
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (!deletingItem) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setTechStack((prev) =>
        prev.filter((item) => item.id !== deletingItem.id)
      );
      setIsLoading(false);
      setIsDeleteOpen(false);
      setDeletingItem(undefined);
    }, 500);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Tech Stack"
        subtitle="Manage your core technologies"
      />

      <main className="flex-1 p-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
