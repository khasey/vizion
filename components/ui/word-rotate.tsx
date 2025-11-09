"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionProps } from "motion/react";

import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div className="shadcn-:overflow-hidden shadcn-:py-2 inline-block">
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[index]}
          className={cn("inline-block px-6 py-2 relative", className)}
          {...motionProps}
        >
          {/* Fond incliné en arrière-plan */}
          <span className="absolute inset-0 bg-primary dark:bg-white -skew-y-1" />
          {/* Texte au premier plan */}
          <span className="relative z-10 text-primary-foreground">
            {words[index]}
          </span>
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
