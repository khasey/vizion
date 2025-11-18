
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { usePathname } from "next/navigation";
import React from "react";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  return (
    <div className="relative flex flex-col min-h-screen">
      {!isDashboard && <Navbar />}
      <main className={`container mx-auto max-w-7xl pt-16 px-6 flex-grow${isDashboard ? "" : ""}`}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}
