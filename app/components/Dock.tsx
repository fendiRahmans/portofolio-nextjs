"use client";

import React from "react";
import DockItem from "./dock/DockItem";
import { usePathname } from "next/navigation";

export interface DockItemConfig {
  icon: string;
  label: string;
  href: string;
  isActive?: boolean;
  variant?: "default" | "primary";
}

interface DockProps {
  items?: DockItemConfig[];
}

export default function Dock({ items }: DockProps) {
  const pathname = usePathname();

  const defaultItems: DockItemConfig[] = [
    { icon: "home", label: "Home", href: "/" },
    { icon: "person", label: "About", href: "/about" },
    { icon: "grid_view", label: "Career Path", href: "/career" },
    { icon: "mail", label: "Contact", href: "/#contact" },
    { icon: "calendar_month", label: "Book", href: "/#book", variant: "primary" },
  ];

  const displayItems = items || defaultItems;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="dock-container h-16 px-4 rounded-full flex items-center gap-2 md:gap-4 transition-all duration-300 hover:px-6">
        {displayItems.map((item, index) => {
          // Calculate active state
          let isActive = item.isActive;

          if (isActive === undefined) {
            // Logic for default active state
            if (item.href === "/" && pathname === "/") {
              isActive = true;
            } else if (item.href !== "/" && item.href.startsWith("/") && pathname === item.href) {
              isActive = true;
            }
          }

          return (
            <React.Fragment key={index}>
              {/* Insert separator before the Contact item (index 3 in default list) */}
              {index === 3 && items === undefined && (
                <div className="w-px h-8 bg-white/10 mx-1"></div>
              )}

              <DockItem {...item} isActive={isActive} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
