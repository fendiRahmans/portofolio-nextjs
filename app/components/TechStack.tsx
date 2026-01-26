import TechCard from "./tech/TechCard";
import { db } from "@/db";
import { techStack } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function TechStack() {
  const technologies = await db
    .select()
    .from(techStack)
    .orderBy(desc(techStack.createdAt));

  return (
    <section className="w-full max-w-5xl glass-panel rounded-3xl p-1 md:p-2 relative overflow-hidden mb-24">
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-center md:justify-between">
        <h3 className="text-white/90 font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            layers
          </span>
          Core Technologies
        </h3>
        <div className="hidden md:flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {technologies.map((tech) => {
          // Check if colors are hex codes or tailwind classes
          const isHexBg = tech.bgColor.startsWith("#") || tech.bgColor.startsWith("rgb");
          const isHexIcon = tech.iconColor.startsWith("#") || tech.iconColor.startsWith("rgb");

          return (
            <TechCard
              key={tech.id}
              title={tech.title}
              description={tech.description}
              icon={
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg ${!isHexBg ? tech.bgColor : ""
                    }`}
                  style={
                    isHexBg
                      ? {
                        backgroundColor: `${tech.bgColor}20`, // Add opacity for hex
                        borderColor: `${tech.bgColor}30`,
                      }
                      : {}
                  }
                >
                  <span
                    className={`material-symbols-outlined text-[24px] ${!isHexIcon ? tech.iconColor : ""
                      }`}
                    style={isHexIcon ? { color: tech.iconColor } : {}}
                  >
                    {tech.iconName}
                  </span>
                </div>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
