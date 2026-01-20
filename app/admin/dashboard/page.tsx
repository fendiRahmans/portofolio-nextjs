"use client";

import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import StatCard from "../../components/admin/StatCard";
import ToggleSwitch from "../../components/admin/ToggleSwitch";

export default function AdminDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);

  // Static data - in real app, this would come from database/API
  const stats = {
    totalTechnologies: 7,
    totalProjects: 12,
    totalContacts: 25,
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your portfolio statistics"
      />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  onChange={setIsAvailable}
                  label={isAvailable ? "Active" : "Inactive"}
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
              value: "+2 this month",
              isPositive: true,
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
              value: "+5 this week",
              isPositive: true,
            }}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              bolt
            </span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:bg-white/5 transition-all duration-300 text-left">
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

            <button className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:bg-white/5 transition-all duration-300 text-left">
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

            <button className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:bg-white/5 transition-all duration-300 text-left">
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
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              inbox
            </span>
            Recent Messages
          </h2>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {[
                {
                  name: "John Doe",
                  email: "john@example.com",
                  message: "Hi, I'm interested in your services...",
                  time: "2 hours ago",
                },
                {
                  name: "Jane Smith",
                  email: "jane@company.com",
                  message: "Would like to discuss a potential project...",
                  time: "5 hours ago",
                },
                {
                  name: "Mike Johnson",
                  email: "mike@startup.io",
                  message: "Great portfolio! Let's connect...",
                  time: "1 day ago",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <span className="text-primary font-semibold text-sm">
                        {contact.name.charAt(0)}
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
                    {contact.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
