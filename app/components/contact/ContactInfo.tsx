"use client";

import React, { useEffect, useState } from "react";
import { getSettings } from "@/actions/settings";

interface ContactData {
  email: string;
  linkedIn: string;
  github: string;
}

export default function ContactInfo() {
  const [contactData, setContactData] = useState<ContactData>({
    email: "Loading...",
    linkedIn: "Loading...",
    github: "Loading...",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const result = await getSettings();
        if (result.success && result.data) {
          const settings = result.data as { name: string; value: string }[];
          const newData: ContactData = { ...contactData };

          settings.forEach((setting) => {
            if (setting.name === "contact_email") {
              newData.email = setting.value;
            } else if (setting.name === "contact_linkedin") {
              newData.linkedIn = setting.value;
            } else if (setting.name === "contact_github") {
              newData.github = setting.value;
            }
          });

          setContactData(newData);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  return (
    <section className="w-full md:w-5/12">
      <div className="glass-heavy p-5 sm:p-8 lg:p-14 rounded-3xl h-full flex flex-col relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-auto">
            <p className="font-display text-primary tracking-[0.3em] uppercase text-xs mb-4 sm:mb-6 font-bold">
              Contact
            </p>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-6xl font-bold leading-[1.1] mb-4 sm:mb-8">
              Let's Build <br />the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Future Together
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-lg font-light leading-relaxed max-w-md mb-6 sm:mb-12">
              I'm currently specialized in building high-performance web applications. Let's discuss your next project or potential collaboration.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <a
              className="glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-5"
              href={`mailto:${contactData.email}`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">
                  mail
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-display font-bold">
                  Direct Email
                </p>
                <p className="text-slate-200 font-medium text-sm sm:text-base truncate">
                  {contactData.email}
                </p>
              </div>
            </a>
            <a
              className="glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-5"
              href={`https://${contactData.linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-blue-400 text-xl sm:text-2xl">
                  link
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-display font-bold">
                  LinkedIn
                </p>
                <p className="text-slate-200 font-medium text-sm sm:text-base truncate">
                  {contactData.linkedIn}
                </p>
              </div>
            </a>
            <a
              className="glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-5"
              href={`https://${contactData.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-slate-300 text-xl sm:text-2xl">
                  code
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-display font-bold">
                  GitHub
                </p>
                <p className="text-slate-200 font-medium text-sm sm:text-base truncate">
                  {contactData.github}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
