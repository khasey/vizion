"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const VizionLogo = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-24 h-10" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="relative w-24 h-10">
      <Image
        src="/Vizion_logo.svg"
        alt="Vizion"
        fill
        className={`object-contain ${isDark ? "invert-0" : "invert"}`}
        priority
      />
    </div>
  );
};
