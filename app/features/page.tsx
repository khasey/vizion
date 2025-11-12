"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function FeaturesPage() {
  const features = [
    {
      icon: "mdi:chart-line-variant",
      title: "Advanced Analytics",
      description:
        "Track your performance with detailed analytics, equity curves, and win rate statistics.",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "Real-time equity curve tracking",
        "Win/loss ratio analysis",
        "Performance metrics dashboard",
      ],
      status: "Available Now",
    },
    {
      icon: "mdi:brain",
      title: "AI Market Predictor",
      description:
        "Leverage AI to predict market direction and optimize your trading strategies.",
      gradient: "from-purple-500 to-pink-500",
      features: [
        "ML-powered predictions",
        "Pattern recognition",
        "Strategy optimization",
      ],
      status: "Beta Access",
    },
    {
      icon: "mdi:shield-check",
      title: "Risk Management",
      description:
        "Advanced tools to manage your risk, set stop losses, and protect your capital.",
      gradient: "from-orange-500 to-red-500",
      features: [
        "Automated stop-loss alerts",
        "Position sizing calculator",
        "Risk/reward analysis",
      ],
      status: "Available Now",
    },
    {
      icon: "mdi:sync",
      title: "Auto Trade Import",
      description:
        "Automatically import trades from your broker or prop firm account in real-time.",
      gradient: "from-green-500 to-emerald-500",
      features: [
        "Real-time synchronization",
        "Multi-broker support",
        "Historical data import",
      ],
      status: "Available Now",
    },
    {
      icon: "mdi:chart-box-outline",
      title: "Custom Reports",
      description:
        "Generate detailed reports and export your trading data in multiple formats.",
      gradient: "from-indigo-500 to-purple-500",
      features: ["PDF & Excel export", "Custom templates", "Scheduled reports"],
      status: "Available Now",
    },
    {
      icon: "mdi:calendar-clock",
      title: "Economic Calendar",
      description:
        "Stay updated with economic events and their potential impact on your trades.",
      gradient: "from-yellow-500 to-orange-500",
      features: [
        "Real-time event updates",
        "Impact level indicators",
        "Custom notifications",
      ],
      status: "Available Now",
    },
  ];

  return (
    <div className="flex flex-col gap-12 py-4 md:py-6 px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold">
          Powerful Features for{" "}
          <span className="text-primary">Serious Traders</span>
        </h1>
        <p className="text-base md:text-lg text-default-600">
          Everything you need to analyze, track, and improve your trading
          performance in one comprehensive platform.
        </p>
        <Button
          as={NextLink}
          href="/signup"
          size="lg"
          color="primary"
          className="font-semibold px-8"
        >
          Start Free Trial
        </Button>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="min-h-[360px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                  <div
                    className={`w-full h-20 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                  >
                    <Icon icon={feature.icon} className="text-4xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-black dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-default-600 dark:text-neutral-400 mb-3">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-success">
                    <Icon icon="mdi:check-circle" className="text-lg" />
                    <span className="text-xs font-semibold">
                      {feature.status}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-default-600 dark:text-neutral-400"
                      >
                        <Icon
                          icon="mdi:circle-small"
                          className="text-primary text-xl mt-0.5 flex-shrink-0"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="w-full max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            More Advanced Features
          </h2>
          <p className="text-lg text-default-600">
            Discover all the tools you need to succeed
          </p>
        </div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={
              <Icon
                icon="mdi:chart-areaspline"
                className="h-6 w-6 text-black dark:text-neutral-400"
              />
            }
            title="Advanced Equity Curve Analysis"
            description="Real-time equity curve tracking, drawdown analysis, and profit factor calculations."
          />

          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={
              <Icon
                icon="mdi:head-lightbulb"
                className="h-6 w-6 text-black dark:text-neutral-400"
              />
            }
            title="Trading Psychology Tracker"
            description="Track your emotional state and identify patterns to improve your trading discipline."
          />

          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={
              <Icon
                icon="mdi:connection"
                className="h-6 w-6 text-black dark:text-neutral-400"
              />
            }
            title="Multi-Broker Integration"
            description="Connect MetaTrader, cTrader, NinjaTrader, and all major prop firms automatically."
          />

          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={
              <Icon
                icon="mdi:robot"
                className="h-6 w-6 text-black dark:text-neutral-400"
              />
            }
            title="AI-Powered Insights"
            description="Get intelligent suggestions to improve your trading strategy based on your data."
          />

          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={
              <Icon
                icon="mdi:file-chart"
                className="h-6 w-6 text-black dark:text-neutral-400"
              />
            }
            title="Custom Reports & Analytics"
            description="Generate detailed reports and export your trading data in multiple formats."
          />
        </ul>
      </section>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-sans text-xl font-semibold text-black md:text-2xl dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm text-black md:text-base dark:text-neutral-400">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
