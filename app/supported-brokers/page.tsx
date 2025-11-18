"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function SupportedBrokersPage() {
  const propFirms = [
    {
      name: "FTMO",
      logo: "/propFirm/FTMO.svg",
      description: "Leading prop trading firm with a proven track record",
      features: [
        "2-step evaluation",
        "Up to $200,000 funding",
        "80% profit split",
      ],
      status: "Fully Supported",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "TopstepTrader",
      logo: "/propFirm/FTMO.svg",
      description: "Futures trading evaluation program",
      features: ["Trading Combine", "Up to $150,000", "90% profit split"],
      status: "Fully Supported",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "The5ers",
      logo: "/propFirm/FTMO.svg",
      description: "Forex-focused prop trading firm",
      features: ["Instant funding", "Up to $250,000", "Aggressive growth"],
      status: "Fully Supported",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "MyForexFunds",
      logo: "/propFirm/FTMO.svg",
      description: "Fast-growing forex prop firm",
      features: ["1-step challenge", "Up to $300,000", "80% profit split"],
      status: "Fully Supported",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Funded Next",
      logo: "/propFirm/FTMO.svg",
      description: "Modern prop firm with flexible options",
      features: ["Multiple challenges", "Up to $200,000", "90% profit split"],
      status: "Fully Supported",
      color: "from-indigo-500 to-purple-500",
    },
    {
      name: "E8 Funding",
      logo: "/propFirm/FTMO.svg",
      description: "Rapid evaluation and funding",
      features: ["Express funding", "Up to $400,000", "80% profit split"],
      status: "Fully Supported",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "FunderPro",
      logo: "/propFirm/FTMO.svg",
      description: "Professional trading environment",
      features: ["2-phase challenge", "Up to $200,000", "80% profit split"],
      status: "Fully Supported",
      color: "from-teal-500 to-cyan-500",
    },
    {
      name: "True Forex Funds",
      logo: "/propFirm/FTMO.svg",
      description: "Transparent and trader-friendly",
      features: ["Fair evaluation", "Up to $200,000", "80% profit split"],
      status: "Fully Supported",
      color: "from-rose-500 to-pink-500",
    },
  ];

  const traditionalBrokers = [
    {
      name: "MetaTrader 4/5",
      icon: "mdi:chart-line",
      description: "Most popular forex trading platform",
      color: "from-blue-500 to-indigo-500",
    },
    {
      name: "cTrader",
      icon: "mdi:chart-areaspline",
      description: "Advanced ECN trading platform",
      color: "from-green-500 to-teal-500",
    },
    {
      name: "NinjaTrader",
      icon: "mdi:chart-box",
      description: "Futures and forex trading platform",
      color: "from-purple-500 to-violet-500",
    },
    {
      name: "TradingView",
      icon: "mdi:chart-multiple",
      description: "Social charting and trading",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <div className="flex flex-col gap-12 py-4 md:py-6 px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold">
          Supported <span className="text-primary">Prop Firms & Brokers</span>
        </h1>
        <p className="text-base md:text-lg text-default-600">
          Seamlessly connect with leading prop trading firms and brokers. Import
          your trades automatically and start analyzing your performance.
        </p>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
          <Icon icon="mdi:check-circle" className="text-success text-xl" />
          <p className="text-success font-semibold text-sm">
            Auto-sync enabled for all supported platforms
          </p>
        </div>
      </section>

      {/* Prop Firms Section */}
      <section className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prop Trading Firms
          </h2>
          <p className="text-lg text-default-600">
            We support all major proprietary trading firms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {propFirms.map((firm, index) => (
            <div key={index} className="min-h-[320px]">
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
                    className={`w-full h-20 rounded-lg bg-gradient-to-br ${firm.color} flex items-center justify-center`}
                  >
                    <div className="text-white text-xl font-bold">
                      {firm.name}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-black dark:text-white">
                      {firm.name}
                    </h3>
                    <p className="text-sm text-default-600 dark:text-neutral-400 mb-3">
                      {firm.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-success">
                    <Icon icon="mdi:check-circle" className="text-lg" />
                    <span className="text-xs font-semibold">{firm.status}</span>
                  </div>
                  <ul className="space-y-2">
                    {firm.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-default-600 dark:text-neutral-400"
                      >
                        <Icon
                          icon="mdi:circle-small"
                          className="text-primary text-xl mt-0.5 flex-shrink-0"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Traditional Brokers Section */}
      <section className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trading Platforms
          </h2>
          <p className="text-lg text-default-600">
            Compatible with popular trading platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {traditionalBrokers.map((broker, index) => (
            <div key={index} className="min-h-[200px]">
              <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 bg-white dark:bg-black border border-divider">
                  <div className="w-fit rounded-lg border border-gray-600 p-2">
                    <Icon
                      icon={broker.icon}
                      className="text-2xl text-black dark:text-neutral-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                      {broker.name}
                    </h3>
                    <p className="text-sm text-default-600 dark:text-neutral-400">
                      {broker.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Connect Section */}
      <section className="w-full max-w-5xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">How to Connect</CardTitle>
            <CardDescription className="text-lg">
              Connect your trading account in just a few simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="text-xl font-bold">Select Your Platform</h3>
                <p className="text-default-600">
                  Choose your prop firm or broker from our supported list
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="text-xl font-bold">Authorize Access</h3>
                <p className="text-default-600">
                  Securely connect your account using our encrypted connection
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="text-xl font-bold">Start Tracking</h3>
                <p className="text-default-600">
                  Your trades will automatically sync and appear in your journal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl text-white">
              Don't See Your Platform?
            </CardTitle>
            <CardDescription className="text-white/90 text-lg mt-2">
              We're constantly adding new integrations. Contact us to request
              support for your broker.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              as={NextLink}
              href="/help"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              Contact Support
            </Button>
            <Button
              as={NextLink}
              href="/signup"
              size="lg"
              variant="bordered"
              className="border-white text-white hover:bg-white/10 font-semibold"
            >
              Start Free Trial
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
