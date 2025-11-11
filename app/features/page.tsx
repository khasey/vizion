"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid } from "@/components/ui/bento-grid";
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { motion } from "motion/react";

export default function FeaturesPage() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]"></BentoGrid>
  );
}
