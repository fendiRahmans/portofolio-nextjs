"use client";

import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import { updateContactStatus, deleteContact } from "@/actions/contact";
import { useRouter } from "next/navigation";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface ContactClientProps {
  initialContacts: ContactMessage[];
}

export default function ContactClient({ initialContacts }: ContactClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<ContactMessage[]>(initialContacts);
  const router = useRouter();

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAsRead = async (id: number) => {
    const result = await updateContactStatus(id, "read");
    if (result.success) {
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "read" } : c))
      );
      router.refresh();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    const result = await deleteContact(id);
    if (result.success) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Contact Messages"
        subtitle="Manage inquiries from your portfolio"
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 items-stretch md:flex-row md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full glass-input bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-initial glass-button bg-white/5 hover:bg-white/10 text-white/70 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex-1 sm:flex-initial glass-button bg-white/5 hover:bg-white/10 text-white/70 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Message Details
                  </th>
                  <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider w-32">
                    Date
                  </th>
                  <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="p-4 text-xs font-semibold text-white/50 uppercase tracking-wider w-20 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-semibold text-sm">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {contact.name}
                            </p>
                            <p className="text-white/40 text-xs">{contact.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <p className="text-white/80 text-sm line-clamp-2">{contact.message}</p>
                      </td>
                      <td className="p-4 align-top whitespace-nowrap">
                        <p className="text-white/50 text-sm">{formatDate(contact.createdAt)}</p>
                      </td>
                      <td className="p-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${contact.status === "new"
                            ? "bg-primary/20 text-primary border-primary/20"
                            : "bg-white/10 text-white/50 border-white/5"
                            }`}
                        >
                          {contact.status === "new" ? "New" : "Read"}
                        </span>
                      </td>
                      <td className="p-4 align-top text-center">
                        <div className="flex justify-center gap-2">
                          {contact.status === "new" && (
                            <button
                              onClick={() => handleMarkAsRead(contact.id)}
                              title="Mark as Read"
                              className="text-white/30 hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                check_circle
                              </span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(contact.id)}
                            title="Delete"
                            className="text-white/30 hover:text-red-400 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/40">
                      No messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
            <span>Showing {filteredContacts.length} of {contacts.length} messages</span>
            <div className="flex gap-2">
              <button className="disabled:opacity-30 hover:text-white transition-colors" disabled>Previous</button>
              <button className="hover:text-white transition-colors">Next</button>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
