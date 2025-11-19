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
      title: "Insights IA",
      icon: "mdi:robot",
      href: "/dashboard/insights",
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

  const SidebarInner = () => (
    <>
      {/* Logo & Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-divider">
        {sidebarOpen && (
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
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
        <div className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
            JD
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">John Doe</p>
              <p className="text-xs text-default-500 truncate">john@example.com</p>
            </div>
          )}
        </div>
        <div className={`${!sidebarOpen ? "justify-center" : ""} flex w-full`}>
          <ThemeSwitch />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-default-50 dark:bg-black min-w-0">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-black border-r border-divider transition-all duration-300 hidden md:flex md:flex-col`}
      >
        <SidebarInner />
      </aside>

      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full bg-white dark:bg-black border-r border-divider">
            <SidebarInner />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="md:hidden p-2"> 
          <Button isIconOnly variant="light" size="sm" onPress={() => setSidebarOpen(true)}>
            <Icon icon="mdi:menu" className="text-xl" />
          </Button>
        </div>
        {children}
      </main>
    </div>
  );
}
