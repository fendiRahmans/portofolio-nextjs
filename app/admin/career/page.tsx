"use client";

import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import { Button } from "../../components/ui/Button";
import {
  CareerFormDialog,
  CareerItem,
} from "../../components/admin/CareerFormDialog";
import { DeleteConfirmDialog } from "../../components/ui/DeleteConfirmDialog";

// Initial static data - matches the original Career page
const initialCareers: CareerItem[] = [
  {
    id: "1",
    year: "2025 — Present",
    title: "Izidok & Hitalent",
    subtitle: "Lead Fullstack & Mobile Architect",
    description:
      "Spearheading the fullstack architecture for the Izidok telemedicine platform and developing the native Hitalent Android ecosystem.",
    icon: "devices",
    color: "primary",
    projectList: [
      { name: "Izidok:", type: "Fullstack Laravel Development" },
      { name: "Hitalent:", type: "Android Flutter App" },
    ],
    techStack: ["Laravel", "Vue.js", "Flutter", "Dart"],
  },
  {
    id: "2",
    year: "2024",
    title: "Frontend Ecosystem",
    subtitle: "Hitalent, Gaidz & Otca Meyer",
    description:
      "Delivered high-performance frontend applications using Next.js and Nuxt.js. Focused on scalable admin panels, dashboards, and user-facing platforms.",
    icon: "code_blocks",
    color: "cyan",
    keyProjects: [
      "Hitalent V3 (Next.js)",
      "Gaidz (Next.js)",
      "Otca Meyer (Nuxt.js)",
      "Superadmin & Personalia",
    ],
    techStack: ["Next.js", "Nuxt.js", "React", "Tailwind"],
  },
  {
    id: "3",
    year: "2023",
    title: "Enterprise Systems",
    subtitle: "OutSystems & Banking Solutions",
    description:
      "Developed critical banking modules and enterprise applications. Specialized in low-code OutSystems solutions and secure React integrations.",
    icon: "apartment",
    color: "purple",
    keyProjects: [
      "NNA",
      "DDMA",
      "Sectara",
      "GTQ",
      "BAT Mobile",
      "BSI Risk (React)",
      "Eduline (Nuxt)",
    ],
    techStack: ["OutSystems", "React.js", "Nuxt.js", "SQL Server"],
  },
  {
    id: "4",
    year: "2022",
    title: "Fullstack Solutions",
    subtitle: "Diverse Client Projects",
    description:
      "Built custom POS systems, non-profit platforms, and educational tools.",
    icon: "web",
    color: "amber",
    bulletPoints: [
      "Cashier Danarhadi",
      "STC Save the Children Platform",
      "Siswa Bekawan Education Tool",
    ],
    techStack: ["Web Development", "POS Systems"],
  },
  {
    id: "5",
    year: "2021",
    title: "System Migrations",
    subtitle: "Web Development & Themes",
    description:
      "Executed system migrations and developed employee management systems.",
    icon: "sync_alt",
    color: "emerald",
    keyProjects: [
      "Migrasi Sipedet",
      "Daftar Karyawan",
      "Tema Jejak Hati",
      "Navila",
      "Pisuka",
    ],
    techStack: ["System Migration", "PHP"],
  },
  {
    id: "6",
    year: "2020",
    title: "App Support",
    subtitle: "Fintech & Services",
    description:
      "Provided technical support and development for Cashme Indosat integration and online dating platforms.",
    icon: "support_agent",
    color: "rose",
    keyProjects: ["Cashme Indosat", "Dating Online Support"],
  },
  {
    id: "7",
    year: "2019",
    title: "The Beginning",
    subtitle: "Junior Fullstack Developer",
    description:
      "Developed the Tiketing Bus Tami Jaya system, streamlining transport booking operations.",
    icon: "directions_bus",
    color: "indigo",
    techStack: ["PHP", "CodeIgniter", "MySQL"],
  },
];

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

export default function AdminCareer() {
  const [careers, setCareers] = useState<CareerItem[]>(initialCareers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CareerItem | undefined>();
  const [deletingItem, setDeletingItem] = useState<CareerItem | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Handle add new career
  const handleAdd = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  // Handle edit career
  const handleEdit = (item: CareerItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (item: CareerItem) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = (data: Omit<CareerItem, "id">) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editingItem) {
        // Update existing
        setCareers((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, ...data } : item
          )
        );
      } else {
        // Add new
        const newItem: CareerItem = {
          ...data,
          id: Date.now().toString(),
        };
        setCareers((prev) => [newItem, ...prev]);
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
      setCareers((prev) => prev.filter((item) => item.id !== deletingItem.id));
      setIsLoading(false);
      setIsDeleteOpen(false);
      setDeletingItem(undefined);
    }, 500);
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
        title="Delete Career Entry"
        message="Are you sure you want to delete this career entry from your timeline?"
        itemName={deletingItem?.title}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}
