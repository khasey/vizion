"use client";

import "@/styles/globals.css";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";
import { fontMono } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-mono antialiased",
          fontMono.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col min-h-screen">
            {!isDashboard && <Navbar />}
            <main className={clsx(
              isDashboard ? "w-full max-w-none flex-grow px-0 pt-0 min-w-0" : "container mx-auto max-w-7xl flex-grow pt-16 px-6"
            )}>
              {children}
            </main>
            {!isDashboard && <Footer />}
          </div>
        </Providers>
      </body>
    </html>
  );
}