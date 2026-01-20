"use client";

import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";

// Mock data type
interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  status: "read" | "unread";
}

export default function AdminContactPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const [contacts] = useState<ContactMessage[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      message: "Hi, I'm interested in your services and would like to know more about your pricing for a full-stack project.",
      date: "2023-10-25",
      status: "unread",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@company.com",
      message: "Would like to discuss a potential partnership. We are a design agency looking for a reliable developer.",
      date: "2023-10-24",
      status: "read",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@startup.io",
      message: "Great portfolio! Let's connect on LinkedIn. I have some questions about your tech stack.",
      date: "2023-10-23",
      status: "read",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.w@creative.net",
      message: "Can you help us build a landing page similar to your portfolio? We love the animations.",
      date: "2023-10-22",
      status: "unread",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.b@techcorp.com",
      message: " hiring for a senior frontend role. Are you available for a quick chat?",
      date: "2023-10-20",
      status: "read",
    }
  ]);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <AdminHeader
        title="Contact Messages"
        subtitle="Manage inquiries from your portfolio"
      />

      <main className="flex-1 p-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
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

          <div className="flex gap-3">
            <button className="glass-button bg-white/5 hover:bg-white/10 text-white/70 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            <button className="glass-button bg-white/5 hover:bg-white/10 text-white/70 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
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
                        <p className="text-white/50 text-sm">{contact.date}</p>
                      </td>
                      <td className="p-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${contact.status === "unread"
                            ? "bg-primary/20 text-primary border-primary/20"
                            : "bg-white/10 text-white/50 border-white/5"
                            }`}
                        >
                          {contact.status === "unread" ? "New" : "Read"}
                        </span>
                      </td>
                      <td className="p-4 align-top text-center">
                        <button className="text-white/30 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">
                            more_vert
                          </span>
                        </button>
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
