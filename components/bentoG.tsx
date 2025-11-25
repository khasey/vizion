"use client";

import { Icon } from "@iconify/react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { DotMap } from "@/components/DotMap";
import { AnimatedListDemo } from "@/components/AnimatedList";
import { OrbitingCirclesDemo } from "@/components/AnimatedGalaxy";

// Wrapper Icon component pour correspondre au format attendu par BentoCard
const IconWrapper = ({ icon }: { icon: string }) => {
  return <Icon icon={icon} className="h-12 w-12" />;
};

export function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-[repeat(3,minmax(15rem,auto))] lg:auto-rows-auto">
      <BentoCard
        Icon={() => <IconWrapper icon="mdi:earth" />}
        name="Global Trading Network"
        description="Connect with traders worldwide and track market movements in real-time"
        href="/features"
        cta="Learn more"
        background={
          <div className="absolute inset-0 h-[500px]">
            <DotMap />
          </div>
        }
        className="lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3 min-h-[500px]"
      />
      <BentoCard
        Icon={() => <IconWrapper icon="mdi:cash-multiple" />}
        name="Recent Payouts"
        description="Live prop firm success stories"
        href="/features"
        cta="Learn more"
        background={
          <div className="absolute inset-0 flex items-start justify-center pt-28 overflow-hidden">
            <AnimatedListDemo />
          </div>
        }
        className="lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3 min-h-[500px]"
      />
      <BentoCard
        Icon={() => <IconWrapper icon="mdi:chart-line" />}
        name="Market Coverage"
        description="Track major indices and stocks"
        href="/features"
        cta="Learn more"
        background={
          <div className="absolute inset-0 flex items-center justify-center translate-y-20">
            <OrbitingCirclesDemo />
          </div>
        }
        className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4 "
      />
      <BentoCard
        Icon={() => <IconWrapper icon="mdi:chart-box" />}
        name="Advanced Analytics"
        description="Comprehensive performance tracking and insights to improve your trading strategy"
        href="/features"
        cta="Learn more"
        background={
          <div className="absolute inset-0 flex items-center justify-center text-default-400">
            <span className="text-lg">Analytics Dashboard Preview</span>
          </div>
        }
        className="lg:col-start-2 lg:col-end-4 lg:row-start-3 lg:row-end-4 "
      />
    </BentoGrid>
  );
}
