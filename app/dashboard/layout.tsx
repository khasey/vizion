"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { VizionLogo } from "@/components/vizion-logo";
import { ThemeSwitch } from "@/components/theme-switch";
import { getUser, signOut } from "@/app/actions/auth";
import FuturisticDashboardLayout from "@/components/ui/FuturisticDashboardLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
      }
    }
    fetchUser();
    setActivePath(window.location.pathname);
  }, []);

   const menuItems = [
    {
      title: "Dashboard",
      icon: "mdi:view-dashboard",
      href: "/dashboard",
      color: "#00ff88"
    },
    {
      title: "My Trades",
      icon: "mdi:chart-line",
      href: "/dashboard/trades",
      color: "#00d4ff"
    },
    {
      title: "Curves",
      icon: "mdi:chart-multiline",
      href: "/dashboard/curves",
      color: "#b366ff"
    },
    {
      title: "Trading Setups",
      icon: "mdi:strategy",
      href: "/dashboard/setups",
      color: "#ffd700"
    },
    {
      title: "Calendar",
      icon: "mdi:calendar",
      href: "/dashboard/calendar",
      color: "#ff6b35"
    },
    {
      title: "Insights IA",
      icon: "mdi:robot",
      href: "/dashboard/insights",
      color: "#00ffcc"
    },
    {
      title: "Upload",
      icon: "mdi:cloud-upload",
      href: "/dashboard/upload",
      color: "#00ff88"
    },
  ];
    const SidebarInner = () => (
    <>
      {/* Logo & Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800/50 relative">
        {/* Grille de fond */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        
        {sidebarOpen && (
          <div className="relative z-10">
            <VizionLogo />
          </div>
        )}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={() => setSidebarOpen(!sidebarOpen)}
          className="relative z-10 hover:bg-[#00ff88]/10 transition-colors"
        >
          <Icon
            icon={sidebarOpen ? "mdi:menu-open" : "mdi:menu"}
            className="text-xl"
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = activePath === item.href;
          return (
            <div key={index} className="relative">
              {/* Barre indicatrice à gauche pour la page active */}
              {isActive && (
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.color}, 0 0 20px ${item.color}40`
                  }}
                />
              )}
              
              <NextLink
                href={item.href}
                onClick={() => setActivePath(item.href)}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-transparent to-transparent"
                    : "hover:bg-gray-800/30"
                }`}
                style={{
                  ...(isActive && {
                    background: `linear-gradient(90deg, ${item.color}15 0%, transparent 100%)`,
                    borderLeft: `2px solid transparent`
                  })
                }}
              >
                {/* Effet de scan au survol */}
                {!isActive && (
                  <div 
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}10, transparent)`,
                    }}
                  />
                )}
                
                {/* Icône avec effet glow */}
                <div className="relative z-10">
                  <Icon 
                    icon={item.icon} 
                    className="text-xl flex-shrink-0 transition-all duration-300"
                    style={{
                      color: isActive ? item.color : 'currentColor',
                      filter: isActive ? `drop-shadow(0 0 8px ${item.color})` : 'none'
                    }}
                  />
                  
                  {/* Point clignotant pour la page active */}
                  {isActive && (
                    <div 
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </div>
                
                {sidebarOpen && (
                  <span 
                    className={`text-sm font-mono transition-all duration-300 relative z-10 ${
                      isActive ? "font-bold" : "font-normal"
                    }`}
                    style={{
                      color: isActive ? item.color : 'currentColor'
                    }}
                  >
                    {item.title}
                  </span>
                )}
                
                {/* Coins décoratifs pour page active */}
                {isActive && sidebarOpen && (
                  <>
                    <div 
                      className="absolute top-1 right-1 w-2 h-2 border-t border-r opacity-30"
                      style={{ borderColor: item.color }}
                    />
                    <div 
                      className="absolute bottom-1 right-1 w-2 h-2 border-b border-r opacity-30"
                      style={{ borderColor: item.color }}
                    />
                  </>
                )}
              </NextLink>
            </div>
          );
        })}
        
   
        
        {/* Theme Switcher */}
        {/* <div 
          className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800/30 transition-colors ${
            !sidebarOpen ? "justify-center" : ""
          }`}
        >
          <ThemeSwitch />
          {sidebarOpen && (
            <span className="text-sm font-mono text-gray-400">Theme</span>
          )}
        </div> */}
      </nav>

      {/* User Profile & Settings */}
      <div className="p-4 border-t border-gray-800/50 space-y-3 relative">
        {/* Grille de fond */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* User Profile */}
        <div className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""} relative z-10`}>
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 font-mono relative group"
            style={{
              background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)'
            }}
          >
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            
            {/* Effet pulse */}
            <div 
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.6)'
              }}
            />
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold font-mono truncate text-white">
                {user?.full_name || 'Loading...'}
              </p>
              <p className="text-xs text-gray-400 truncate font-mono">
                {user?.email || ''}
              </p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {sidebarOpen && (
          <Button
            variant="light"
            className="w-full justify-start text-red-400 hover:bg-red-500/10 transition-all font-mono relative z-10 group"
            onPress={async () => {
              await signOut();
              window.location.href = '/signin';
            }}
          >
            <Icon icon="mdi:logout" className="text-lg" />
            <span className="text-sm">DISCONNECT</span>
            
            {/* Effet de scan au survol */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        )}
        
        {/* Collapsed logout */}
        {!sidebarOpen && (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={async () => {
              await signOut();
              window.location.href = '/signin';
            }}
            title="Se déconnecter"
            className="mx-auto hover:bg-red-500/10 transition-colors relative z-10"
          >
            <Icon icon="mdi:logout" className="text-lg text-red-400" />
          </Button>
        )}
        
        {/* Coins décoratifs */}
        {/* <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[#00ff88]/20" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[#00ff88]/20" /> */}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-default-50 dark:bg-black min-w-0">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-black border-r border-gray-800/50 transition-all duration-300 hidden md:flex md:flex-col`}
      >
        <SidebarInner />
        {/* <FuturisticDashboardLayout /> */}
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
      <main className="flex-1 overflow-y-auto min-w-0 pt-0 md:pt-0">
        <div className="md:hidden p-2 border-b border-divider"> 
          <Button isIconOnly variant="light" size="sm" onPress={() => setSidebarOpen(true)}>
            <Icon icon="mdi:menu" className="text-xl" />
          </Button>
        </div>
        {children}
      </main>
    </div>
  );
}
