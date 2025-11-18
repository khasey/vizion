"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { VizionLogo } from "@/components/vizion-logo";
import { ThemeSwitch } from "@/components/theme-switch";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      title: "Dashboard",
      icon: "mdi:view-dashboard",
      href: "/dashboard",
    },
    {
      title: "My Trades",
      icon: "mdi:chart-line",
      href: "/dashboard/trades",
    },
    {
      title: "Curves",
      icon: "mdi:chart-multiline",
      href: "/dashboard/curves",
    },
    {
      title: "Analytics",
      icon: "mdi:chart-bar",
      href: "/dashboard/analytics",
    },
    {
      title: "Calendar",
      icon: "mdi:calendar",
      href: "/dashboard/calendar",
    },
    {
      title: "Reports",
      icon: "mdi:file-document",
      href: "/dashboard/reports",
    },
    {
      title: "Brokers",
      icon: "mdi:connection",
      href: "/dashboard/brokers",
    },
    {
      title: "Settings",
      icon: "mdi:cog",
      href: "/dashboard/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-default-50 dark:bg-black">
      {/* Sidebar */}
      <aside
        className={`$${sidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-black border-r border-divider transition-all duration-300 flex flex-col`}
      >
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-divider">
          {sidebarOpen && (
            // <h1 className="text-xl font-bold text-primary">Vizion</h1>
            <VizionLogo />
          )}
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => setSidebarOpen(!sidebarOpen)}
          >
            <Icon
              icon={sidebarOpen ? "mdi:menu-open" : "mdi:menu"}
              className="text-xl"
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive =
              typeof window !== "undefined" &&
              window.location.pathname === item.href;
            return (
              <NextLink
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors $${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-default-600 hover:bg-default-100 dark:hover:bg-default-200"
                }`}
              >
                <Icon icon={item.icon} className="text-xl flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.title}</span>}
              </NextLink>
            );
          })}
        </nav>

        {/* User Profile & Theme Switch */}
        <div className="p-4 border-t border-divider flex flex-col gap-4">
          <div
            className={`flex items-center gap-3 $${!sidebarOpen && "justify-center"}`}
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
              JD
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">John Doe</p>
                <p className="text-xs text-default-500 truncate">
                  john@example.com
                </p>
              </div>
            )}
          </div>
          <div
            className={`${!sidebarOpen ? "justify-center" : ""} flex w-full`}
          >
            <ThemeSwitch />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
