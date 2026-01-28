"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import StatCard from "../../components/admin/StatCard";
import ToggleSwitch from "../../components/admin/ToggleSwitch";
import { getAvailableForHire, toggleAvailableForHire } from "@/actions/settings";
import { getTechStackCount } from "@/actions/tech-stack";
import { getCareerCount, getCareerCountThisMonth } from "@/actions/career";
import { getContactCount, getRecentContacts, getContactCountThisWeek } from "@/actions/contact";

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTechnologies: 0,
    totalProjects: 0,
    totalContacts: 0,
    projectsThisMonth: 0,
    contactsThisWeek: 0,
  });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all data in parallel
      const [status, techCount, careerCount, contactCount, contacts, careerThisMonth, contactThisWeek] = await Promise.all([
        getAvailableForHire(),
        getTechStackCount(),
        getCareerCount(),
        getContactCount(),
        getRecentContacts(3),
        getCareerCountThisMonth(),
        getContactCountThisWeek(),
      ]);

      setIsAvailable(status);
      setStats({
        totalTechnologies: techCount,
        totalProjects: careerCount,
        totalContacts: contactCount,
        projectsThisMonth: careerThisMonth,
        contactsThisWeek: contactThisWeek,
      });

      if (contacts.success) {
        setRecentContacts(contacts.data);
      }

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setIsAvailable(checked);
    const result = await toggleAvailableForHire(checked);
    if (!result.success) {
      setIsAvailable(!checked); // Revert on failure
    }
  };

  const getRelativeTime = (date: Date | null) => {
    if (!date) return "N/A";

    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(date).toLocaleDateString();
  };


  return (
    <AdminLayout>
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your portfolio statistics"
      />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Available for Hire Card */}
          <div className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5">
            <div className="flex items-start justify-between">
              <div
                className={`size-12 rounded-xl flex items-center justify-center border border-white/10 ${isAvailable ? "bg-green-500/20" : "bg-white/10"
                  }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] ${isAvailable ? "text-green-400" : "text-white/50"
                    }`}
                >
                  work
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-white/50 text-sm">Available for Hire</p>
              <div className="mt-3">
                <ToggleSwitch
                  checked={isAvailable}
                  onChange={handleToggle}
                  label={isLoading ? "Loading..." : (isAvailable ? "Active" : "Inactive")}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Total Technologies */}
          <StatCard
            icon="layers"
            iconColor="text-blue-400"
            iconBgColor="bg-blue-500/20"
            title="Total Technologies"
            value={stats.totalTechnologies}
            subtitle="Core tech stack"
          />

          {/* Total Projects */}
          <StatCard
            icon="folder_open"
            iconColor="text-purple-400"
            iconBgColor="bg-purple-500/20"
            title="Total Projects"
            value={stats.totalProjects}
            subtitle="Completed works"
            trend={{
              value: stats.projectsThisMonth > 0 ? `+${stats.projectsThisMonth} this month` : "No new projects",
              isPositive: stats.projectsThisMonth > 0,
            }}
          />

          {/* Total Contacts */}
          <StatCard
            icon="mail"
            iconColor="text-orange-400"
            iconBgColor="bg-orange-500/20"
            title="Total Contacts"
            value={stats.totalContacts}
            subtitle="Messages received"
            trend={{
              value: stats.contactsThisWeek > 0 ? `+${stats.contactsThisWeek} this week` : "No new messages",
              isPositive: stats.contactsThisWeek > 0,
            }}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px]">
              bolt
            </span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <button onClick={() => router.push("/admin/career")} className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:bg-primary/10 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-left border border-transparent hover:border-primary/50 cursor-pointer">
              <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  add
                </span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Add Project</p>
                <p className="text-white/40 text-xs">Create new portfolio item</p>
              </div>
            </button>

            <button onClick={() => router.push("/admin/about")} className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:bg-green-500/10 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 text-left border border-transparent hover:border-green-500/50 cursor-pointer">
              <div className="size-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-400 text-[20px]">
                  edit
                </span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Edit Profile</p>
                <p className="text-white/40 text-xs">Update your information</p>
              </div>
            </button>

            <button onClick={() => router.push("/")} className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:bg-purple-500/10 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 text-left border border-transparent hover:border-purple-500/50 cursor-pointer">
              <div className="size-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400 text-[20px]">
                  visibility
                </span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">View Portfolio</p>
                <p className="text-white/40 text-xs">See your public site</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Contacts Section */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px]">
              inbox
            </span>
            Recent Messages
          </h2>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {recentContacts.length === 0 ? (
                <div className="p-8 text-center text-white/50">
                  <span className="material-symbols-outlined text-[48px] mb-2">
                    inbox
                  </span>
                  <p>No messages yet</p>
                </div>
              ) : (
                recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <span className="text-primary font-semibold text-sm">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {contact.name}
                        </p>
                        <p className="text-white/50 text-xs truncate max-w-[200px] md:max-w-[300px]">
                          {contact.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-white/30 text-xs whitespace-nowrap">
                      {getRelativeTime(contact.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
